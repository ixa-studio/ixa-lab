// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  //const input = JSON.parse(req.body).prompt_input;
  console.log('input', req.body);
  console.log('input', req.body.prompt_input);
  //const image = JSON.parse(req.body).image;
  //const input = req.body.prompt_input;
  //console.log('image', image);
  //console.log('input', input);
  res.status(200).json({ name: 'John Doe' });
}
