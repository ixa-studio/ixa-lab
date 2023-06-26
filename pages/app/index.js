import { Button, Label, Textarea } from 'flowbite-react';
import { Inter } from 'next/font/google';
import { useCallback, useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const maxRetries = 20;
  const [idea, setIdea] = useState({ image: null, prompt_input: '' });
  const [renderedImage, setRenderedImage] = useState(null);
  const [base64, setBase64] = useState(null);
  const [retry, setRetry] = useState(0);
  // Number of retries left
  const [retryCount, setRetryCount] = useState(maxRetries);
  const [isGenerating, setIsGenerating] = useState(false);

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleChange = useCallback(
    async (event) => {
      console.log('event.target.name', event.target.name);
      if (event.target.name === 'image') {
        setIdea({ ...idea, [event.target.name]: event.target.files[0] });
        const file = await toBase64(event.target.files[0]);
        setBase64(file);
      } else
        setIdea({ ...idea, [event.target.name]: event.target.value.trim() });
    },
    [idea]
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!idea.image) {
        alert('Please upload an image');
        return;
      }

      if (!idea.prompt_input) {
        alert('Please write a prompt');
        return;
      }

      console.log('Generating...');

      // Add this check to make sure there is no double click
      if (isGenerating && retry === 0) return;

      // Set loading has started
      setIsGenerating(true);

      // If this is a retry request, take away retryCount
      if (retry > 0) {
        setRetryCount((prevState) => {
          if (prevState === 0) {
            return 0;
          } else {
            return prevState - 1;
          }
        });

        setRetry(0);
      }

      const response = await fetch('/api/banana', {
        method: 'POST',
        /*
        headers: {
          'Content-Type': 'image/jpeg',
        },*/
        body: JSON.stringify({
          prompt_input: idea.prompt_input,
          base64: base64,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (response.status === 503) {
        // Set the estimated_time property in state
        setRetry(data.estimated_time);
        return;
      }

      if (!response.ok) {
        console.log(`Error: ${data.error}`);
        setIsGenerating(false);

        return;
      }

      if (data.image) {
        setRenderedImage(data.image);
        console.log(data.image);
        setIsGenerating(false);
      }
    },
    [idea.image, idea.prompt_input]
  );

  useEffect(() => {
    const runRetry = async () => {
      if (retryCount === 0) {
        console.log(
          `Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`
        );
        setRetryCount(maxRetries);
        return;
      }

      console.log(`Trying again in ${retry} seconds.`);

      await sleep(retry * 1000);

      await generateAction();
    };

    if (retry === 0) {
      return;
    }

    runRetry();
  }, [retry]);

  const { image } = idea;

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
              {image && (
                <img
                  src={URL.createObjectURL(image)}
                  alt="image uploaded"
                  className="w-full"
                />
              )}
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {!image && (
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
                            <span className="font-semibold">
                              Click to upload
                            </span>{' '}
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
                )}
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
                {!isGenerating ? (
                  <Button type="submit">Crea tu render</Button>
                ) : (
                  <>
                    <Button type="submit" disabled="true">
                      Estamos creando tu render
                    </Button>
                    <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                      Estamos creando lo que imaginaste. Esto puede tardar unos
                      minutos.
                    </p>
                  </>
                )}
              </form>
            </div>
            <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
              {/*           <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQreGuTWE5LNQBWVcaRvV_8XKfw0zAOvnI8m4Wf1qZhUAewecNVcPVDHRFcSntWbDLuy30&usqp=CAU"
                alt="mockup"
              />*/}
              {renderedImage && (
                <div className="mt-4">
                  <h2 className="mb-2">Rendered Image:</h2>
                  <img src={renderedImage} className="w-full" alt={'input'} />
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
