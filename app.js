const qrcode = require("qrcode-terminal");
require("dotenv/config");
const { Client, LocalAuth } = require("whatsapp-web.js");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  organization: process.env.organization,
  apiKey: process.env.apiKey,
});
const openai = new OpenAIApi(configuration);

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.initialize();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
  console.log("AUTHENTICATED");
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (message) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: message.body,
      temperature: 0.1,
      max_tokens: 500,
      top_p: 1.0,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
    });

    message.reply(response.data.choices[0].text.replace("\n\n", ""));
  } catch (error) {
    console.log(error);
  }
});
