import { surpriseMePrompts } from "../constants";

export function getRandomPropmt(prompt) {
    const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length)
    const randomPrompt = surpriseMePrompts[randomIndex]

    if(randomPrompt === prompt) return getRandomPropmt(prompt)

    return randomPrompt
}