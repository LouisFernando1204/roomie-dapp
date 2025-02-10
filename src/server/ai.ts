import axios from "axios";
import { BACKEND_API_URL } from "../global/global";
import DOMPurify from "dompurify";

export async function askToGPT(
    _message: string
) {
    try {
        const res = await axios.post(`${BACKEND_API_URL}ai`, {
            message: _message
        });
        console.log("RES DI SERVER: ", res);
        return formatGPTResponse(res.data.response);
    } catch (error) {
        console.log(error);
        return;
    }
}

function formatGPTResponse(response: string) {
    const formattedText = response
        .replace(/### (.*?)\n/g, "<h3>$1</h3>")
        .replace(/#### (.*?)\n/g, "<h4>$1</h4>")
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/\*(.*?)\*/g, "<i>$1</i>")
        .replace(/- (.*?)\n/g, "<li>$1</li>")
        .replace(/\n/g, "<br>");

    return DOMPurify.sanitize(formattedText);
}