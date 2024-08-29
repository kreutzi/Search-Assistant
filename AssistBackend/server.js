// server.js
require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { search, ResultTypes } = require("google-sr");

const app = express();
const port = process.env.PORT || 3000;

// Replace with your actual API key
const API_KEY = process.env.GEMINI_API_KEY;

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(API_KEY);
// MongoDB connection
const MONGO_URL = "mongodb://localhost:27017/gemassist";
mongoose
	.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Connected to local MongoDB"))
	.catch((err) => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth routes
app.use("/auth", require("./routes/authRoutes"));

// Search function
async function performSearch(searchQuery) {
	console.log(searchQuery);
	const searchResults = await search({
		query: searchQuery,
		safeMode: false,
		filterResults: [ResultTypes.SearchResult],
	});
	return searchResults.map((result) => ({
		title: result.title,
		snippet: result.description,
		link: result.link,
	}));
}

// Gemini function definition
const searchFunction = {
	name: "performSearch",
	description: "Perform a web search based on the given query",
	parameters: {
		type: "object",
		properties: {
			query: {
				type: "string",
				description: "The search query",
			},
		},
		required: ["query"],
	},
};

const model = genAI.getGenerativeModel({
	model: "gemini-1.0-pro",

	tools: {
		functionDeclarations: [searchFunction],
	},
});
const chat = model.startChat();

// Chat route
app.post("/chat", async (req, res) => {
	try {
		const { message, currentUser } = req.body;
		const decoded = jwt.verify(currentUser, process.env.JWT_SECRET_KEY);
		// Initialize the model (using Gemini-Pro for text generation)
		// Initialize the model

		// First, ask Gemini if a search is needed
		const initialPrompt = `
		You are GemAssist, a helpful and knowledgeable AI assistant reply normally and USE SEARCH IF ONLY NEEDED. 
		A user has asked the following question: "${message}"

		Please follow these instructions carefully:
		1.Can you answer the question directly?Think about whether you have the information to provide a complete and accurate answer based on your internal knowledge.
		2.If YES:Provide a concise and informative response. 
		3.If NO:Use the performSearch tool to find the information . 
		`;

		const initialResult = await chat.sendMessage(initialPrompt);
		let call;
		try {
			call = initialResult.response.functionCalls()[0];
		} catch {
			call = false;
		}
		console.log(call);

		let finalResponse;

		if (call) {
			// Search was deemed necessary
			const searchQuery = call.args.query;
			console.log(typeof call.args.query);
			const searchResults = await performSearch(searchQuery);

			// Generate final response with search results
			const finalPrompt = `
      User Query: ${message}

      Search Results:
      ${JSON.stringify(searchResults, null, 2)}

      Please provide a concise, well-formatted response to the user's query. 
      Incorporate relevant information from the search results to support your response.
     	MAKE SURE TO Include source links in your response using Markdown format: [Source Title](URL)
      If you use information from a specific source, please cite it.
      `;

			const finalResult = await chat.sendMessage(finalPrompt);
			finalResponse = finalResult.response.text();
		} else {
			// No search was needed
			finalResponse = initialResult.response.text();
		}

		res.json({ reply: finalResponse });
	} catch (error) {
		console.error("Error:", error);
		res
			.status(500)
			.json({ error: "An error occurred while processing your request." });
	}
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
