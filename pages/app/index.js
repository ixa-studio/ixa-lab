import { Button, Label, Textarea } from 'flowbite-react';
import { Inter } from 'next/font/google';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [idea, setIdea] = useState({ image: null, prompt_input: '' });

  const handleChange = (event) => {
    console.log('event.target.name', event.target.name);
    if (event.target.name === 'image') {
      setIdea({ ...idea, [event.target.name]: event.target.files[0] });
    } else setIdea({ ...idea, [event.target.name]: event.target.value });

    console.log('idea', idea);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', idea.image);
    formData.append('prompt_input', idea.prompt_input);

    console.log('formData', formData);

    const payload = {
      image: idea.image,
      prompt_input: idea.prompt_input,
    };
    console.log('payload', payload);

    const response = await fetch('/api/hello', {
      method: 'POST',
      body: payload,
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <section className="bg-white dark:bg-gray-900">
          <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
            <div className="mr-auto place-self-center lg:col-span-7">
              <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
                Renders arquitectónicos con inteligencia artificial
              </h1>
              <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                Cualquier tipo de render es posible, interiores, exteriores,
                conceptuales, las posibilidades son infinitas.
              </p>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="dropzone-file" value="Sube tu sketch" />
                  </div>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          aria-hidden="true"
                          className="w-10 h-10 mb-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          ></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{' '}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        name="image"
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                </div>
                <div id="textarea">
                  <div className="mb-2 block">
                    <Label htmlFor="prompt" value="Cuéntanos tu idea" />
                  </div>
                  <Textarea
                    id="prompt"
                    placeholder="Casa moderna de 2 plantas..."
                    required={true}
                    rows={4}
                    name="prompt_input"
                    value={idea.prompt_input}
                    onChange={handleChange}
                  />
                </div>
                <Button type="submit">Crea tu render</Button>
              </form>
            </div>
            <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQreGuTWE5LNQBWVcaRvV_8XKfw0zAOvnI8m4Wf1qZhUAewecNVcPVDHRFcSntWbDLuy30&usqp=CAU"
                alt="mockup"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
