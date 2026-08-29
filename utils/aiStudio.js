import 'dotenv/config';

const getAiApiResponse=async(message)=>{
    const options={
    method:"POST",
    headers:{
      "x-goog-api-key": `${process.env.GEMINI_API_KEY}`,
      'Content-Type':'application/json',
    },
    body: JSON.stringify({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text:message,
            }
          ]
        }
      ]
    })
  };

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', options);
    const data = await response.json();
    // console.log(data.candidates[0].content.parts[0].text);
    return (data.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
 
  }  
}
 
export default getAiApiResponse;