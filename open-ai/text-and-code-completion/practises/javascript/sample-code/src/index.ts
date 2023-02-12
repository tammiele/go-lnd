import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

import type { CreateCompletionRequest } from "openai";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const textCompletionRequest: CreateCompletionRequest = {
  model: "text-davinci-003",
  prompt: "How to become a good person?",
  temperature: 0,
  max_tokens: 3999,
  top_p: 1,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
};

const codeCompletionRequest: CreateCompletionRequest = {
  model: "code-davinci-002",
  prompt: "Sum two numbers in JS?",
  temperature: 0,
  max_tokens: 2047,
  top_p: 1,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
};

openai
  .createCompletion(textCompletionRequest)
  .then((res) => console.log("Response text:", res.data.choices[0].text))
  .catch((error) => console.error("Error:", error));

openai
  .createCompletion(codeCompletionRequest)
  .then((res) => console.log("Response code:", res.data.choices[0].text))
  .catch((error) => console.error("Error:", error));
