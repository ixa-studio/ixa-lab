//import * as banana from "@banana-dev/banana-dev";
const banana = require('@banana-dev/banana-dev');
// Enter your Banana API keys in .env.local
const apiKey = process.env.NEXT_PUBLIC_BANANA;
const modelKey = process.env.NEXT_PUBLIC_MODEL;

const bufferToBase64 = (buffer: ArrayBuffer) => {
  let arr = new Uint8Array(buffer);

  const base64 = btoa(
    arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
  );

  return `data:image/png;base64,${base64}`;
};

export default async function (req, res) {
  //const image = fs.readFileSync('./sketch4.png', {encoding: 'base64'});
  // console.log(req.body);
  const input = req.body.prompt_input;
  const image = req.body.image;

  const modelParameters = {
    prompt:
      'A photograph taken with a professional camera at f/2.8, 1/100 second shutter speed, ISO 400, with daylight white balance and 5000k color temperature. In the image you can see a modern house made of hyper-realistic glass, and behind it a beautiful sky.',
    negative_prompt:
      'monochrome, lowres, bad anatomy, worst quality, low quality',
    num_inference_steps: 20,
    image_data: image,
  };
  try {
    const response = await banana.run(apiKey, modelKey, modelParameters);
    console.log(response);
    //const buffer = await response?.modelOutputs[0].canny_base64;
    const base64 = response?.modelOutputs[0].image_base64;
    //console.log(base64);
    // Make sure to change to base64
    res.status(200).json({ image: `data:image/png;base64,${base64}` });
    /*
        if (response.ok) {
            const buffer = await response?.modelOutputs[0].canny_base64.arrayBuffer();
            const base64 = bufferToBase64(buffer);
            // Make sure to change to base64
            res.status(200).json({ image: base64 });
          } else if (response.status === 503) {
            const json = await response.json();
            res.status(503).json(json);
          } else {
            console.log('error en el response')
            //const json = await response.clone().json();
            res.status(response.status).json({ error: response.statusText });
          }*/
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
