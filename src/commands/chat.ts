import readline from "readline";
import { logger } from "@/utils/logger";
import { model } from "@/utils/model";
import { Command } from "commander";
import { HumanMessage, SystemMessage } from "langchain/schema";
import ora from "ora";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "~ ",
  terminal: false
});

export const chat = new Command()
  .name("chat")
  .description("chat with ai")
  .action(async () => {
    const spinner = ora("thinking..");

    logger.success("Hello! How I can help you?");
    logger.info("");

    rl.prompt();

    rl.on("line", async (line) => {
      const messages = [
        new SystemMessage(
          "You are an AI assistant that responds to questions and commands just in very simple plain text format, without any markdown elements like **bold**, italic, ```code```, quote, or tables. When I ask you something, you have to respond directly, concisely, and precisely with only the relevant explanation or meaning, without any unnecessary commentary or introductory phrases and if additional information is required, include a resource link such as 'read more here ->'"
        ),
        new HumanMessage(line.trim())
      ];

      switch (line.trim()) {
        case "exit":
          process.exit(0);
          // TODO: remove break later
          break;
        case "cls":
          console.clear();
          break;
        default: {
          spinner.start();
          const stream = await model.stream(messages);

          for await (const chunk of stream) {
            if (spinner.isSpinning) {
              spinner.stop();
            }
            process.stdout.write(chunk.content as string);
          }
        }
      }
      rl.prompt();
    }).on("close", () => {
      process.exit(0);
    });
  });