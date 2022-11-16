import { Constants } from "eris";

export default {
  data: {
    name: "autocomplete",
    description: "Autocomplete",
    options: [{
      name: "colour",
      description: "choose a colour!",
      type: Constants.ApplicationCommandOptionTypes.STRING,
      autocomplete: true,
      required: true
    }]
  },
  autocomplete: async (client, interaction) => {
    await interaction.result(
      { name: "red", value: "red" },
      { name: "blue", value: "blue" },
      { name: "green", value: "green" },
      { name: "yellow", value: "yellow" },
      { name: "purple", value: "purple" },
      { name: "black", value: "black" },
      { name: "white", value: "white" }
    );
  },
  run: async (client, interaction) => {
    const colour = interaction.data.options[0].value;
    await interaction.createMessage({ content: `You choose ${colour}` });
  }
}