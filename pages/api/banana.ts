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

const base64ToArrayBuffer = (base64) => {
  const binaryString = atob(base64);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
};

export default async function (req, res) {
  //const image = fs.readFileSync('./sketch4.png', {encoding: 'base64'});
  // console.log(req.body);
  const body = JSON.parse(req.body);
  //console.log(body);
  const input = await body.prompt_input;
  const img = await body.base64;
  console.log(input);

  const image = img.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

  const modelParameters = {
    prompt: input,
    negative_prompt:
      'monochrome, lowres, bad anatomy, worst quality, low quality',
    num_inference_steps: 20,
    image_data: image,
  };
  try {
    if (image) {
      const response = await banana.run(apiKey, modelKey, modelParameters);
      //console.log(response);
      //const buffer = await response?.modelOutputs[0].canny_base64;
      //const base64 = response?.modelOutputs[0].image_base64;
      //console.log(base64);
      // Make sure to change to base64
      //res.status(200).json({ image: `data:image/png;base64,${base64}` });

      if (response) {
        const buf = await response?.modelOutputs[0]?.image_base64;
        const buffer = base64ToArrayBuffer(buf);
        const base64 = bufferToBase64(buffer);
        // Make sure to change to base64
        res.status(200).json({ image: base64 });
      } else if (response.status === 503) {
        const json = await response.json();
        res.status(503).json(json);
      } else {
        console.log('error en el response');
        //const json = await response.clone().json();
        res.status(response.status).json({ error: response.statusText });
      }
    } else {
      console.log('no hay imagen');
      res.status(200).json({ image: 'no hay imagen' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
