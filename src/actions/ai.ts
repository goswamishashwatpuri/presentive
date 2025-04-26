'use server'

import { currentUser } from "@clerk/nextjs/server"
import { layoutGenerationSession, outlineGenerationSession } from "./aiModel"
import { client } from "@/lib/prisma"
import { v4 as uuidv4 } from 'uuid';
import { ContentType, Slide, ContentItem } from "@/lib/types";
import { generateImageWithGeiminiTest } from "./imageGenModel";

export const generateCreativePrompt = async (prompt: string) => {
  const finalPrompt = `
  Create a coherent and relevant outline for the following prompt: ${prompt}.
  The outline should consist of at least 6 points, with each point written as a single sentence.
  Ensure the outline is well-structured and directly related to the topic. 
  Return the output in the following JSON format:

  {
    "outlines": [
      "Point 1",
      "Point 2",
      "Point 3",
    ]
  }

  Ensure that the JSON is valid and properly formatted. Do not include any other text or explanations outside the JSON.
  `;

  try {
    const result = await outlineGenerationSession.sendMessage(finalPrompt)
    const jsonResponse = JSON.parse(result.response.text())
    console.log("🔴 JSON RESPONSE: ", jsonResponse)
    if (jsonResponse.outlines.length === 0) {
      return { status: 500, message: "No outlines generated" }
    }

    return {
      status: 200,
      data: jsonResponse
    }

  } catch (error) {
    console.error("🔴 ERROR: ", error)
    return { status: 500, message: "Error generating outlines" }
  }

}

const existingLayouts = [
  {
    "slideName": "Blank card",
    "type": "blank-card",
    "className": "p-8 mx-auto flex justify-center items-center min-h-[200px]",
    "content": {
      "id": "8c71428b-d684-4fe9-ba0c-846f2d85ccf4",
      "type": "column",
      "name": "Column",
      "content": [
        {
          "id": "957713f7-ed1f-4aa7-b4ae-f261672c99ce",
          "type": "title",
          "name": "Title",
          "content": "",
          "placeholder": "Untitled Card"
        }
      ]
    }
  },
  {
    "slideName": "Accent left",
    "type": "accentLeft",
    "className": "min-h-[300px]",
    "content": {
      "id": "c7d03d01-e89c-4739-8710-4afcd7a92323",
      "type": "column",
      "name": "Column",
      "restrictDropTo": true,
      "content": [
        {
          "id": "58db41e7-589f-4158-9b35-85f5982f06e4",
          "type": "resizable-column",
          "name": "Resizable column",
          "restrictToDrop": true,
          "content": [
            {
              "id": "c944a447-8443-453c-b115-63d63767380e",
              "type": "image",
              "name": "Image",
              "content": "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              "alt": "Title"
            },
            {
              "id": "6307e6f5-ce5f-44cf-9451-2fa0514aa5f5",
              "type": "column",
              "name": "Column",
              "content": [
                {
                  "id": "77c28eda-11a0-4c55-ac9c-8848d7b3e795",
                  "type": "heading1",
                  "name": "Heading1",
                  "content": "",
                  "placeholder": "Heading1"
                },
                {
                  "id": "5eeb5d35-693f-4626-b253-52c6cc92b2c4",
                  "type": "paragraph",
                  "name": "Paragraph",
                  "content": "",
                  "placeholder": "start typing here"
                }
              ],
              "className": "w-full h-full p-8 flex justify-center items-center",
              "placeholder": "Heading1"
            }
          ]
        }
      ]
    }
  },
  {
    "slideName": "Accent Right",
    "type": "accentRight",
    "className": "min-h-[300px]",
    "content": {
      "id": "dde1cdce-9141-4fa3-8d9e-60dbef323495",
      "type": "column",
      "name": "Column",
      "content": [
        {
          "id": "4ce5117c-3295-480a-82d5-731fc757c834",
          "type": "resizable-column",
          "name": "Resizable column",
          "restrictToDrop": true,
          "content": [
            {
              "id": "ad8015a6-45c5-457a-a74e-b670b433f893",
              "type": "column",
              "name": "Column",
              "content": [
                {
                  "id": "e55804cb-aaa1-4cd9-b71c-73e7efab054a",
                  "type": "heading1",
                  "name": "Heading1",
                  "content": "",
                  "placeholder": "Heading1"
                },
                {
                  "id": "b46ee86e-2783-49db-9d13-e7f13deab5c7",
                  "type": "paragraph",
                  "name": "Paragraph",
                  "content": "",
                  "placeholder": "start typing here"
                }
              ],
              "className": "w-full h-full p-8 flex justify-center items-center",
              "placeholder": "Heading1"
            },
            {
              "id": "26cc47d0-4022-4a85-8f39-7e1f47c8c86c",
              "type": "image",
              "name": "Image",
              "restrictToDrop": true,
              "content": "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              "alt": "Title"
            }
          ]
        }
      ]
    }
  },
  {
    "slideName": "Image and text",
    "type": "imageAndText",
    "className": "min-h-[200px] p-8 mx-auto flex justify-center items-center",
    "content": {
      "id": "c51f5030-297d-4a5c-8a9f-4f4ebafff663",
      "type": "column",
      "name": "Column",
      "content": [
        {
          "id": "9c1f1cec-0f53-4049-aff2-d5532dcc76b4",
          "type": "resizable-column",
          "name": "Image and text",
          "className": "border",
          "content": [
            {
              "id": "3c82d31b-ddfd-46b0-88ea-b3e3f129405a",
              "type": "column",
              "name": "Column",
              "content": [
                {
                  "id": "23c42032-9ebe-4f27-9134-c0fe99c75870",
                  "type": "image",
                  "name": "Image",
                  "className": "p-3",
                  "content": "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  "alt": "Title"
                }
              ]
            },
            {
              "id": "2c44287f-490b-4bf7-9139-fdf8676c6aba",
              "type": "column",
              "name": "Column",
              "content": [
                {
                  "id": "c11a9504-1e8f-4db8-9c53-722134f6f8b8",
                  "type": "heading1",
                  "name": "Heading1",
                  "content": "",
                  "placeholder": "Heading1"
                },
                {
                  "id": "8351ff2b-56e7-48b7-839d-d5012a19eca4",
                  "type": "paragraph",
                  "name": "Paragraph",
                  "content": "",
                  "placeholder": "start typing here"
                }
              ],
              "className": "w-full h-full p-8 flex justify-center items-center",
              "placeholder": "Heading1"
            }
          ]
        }
      ]
    }
  },
  {
    "slideName": "Text and image",
    "type": "textAndImage",
    "className": "min-h-[200px] p-8 mx-auto flex justify-center items-center",
    "content": {
      "id": "8d92fa16-23f0-4266-89ae-4bd28009a146",
      "type": "column",
      "name": "Column",
      "content": [
        {
          "id": "024d418e-d305-4431-81d1-68ac72f54e94",
          "type": "resizable-column",
          "name": "Text and image",
          "className": "border",
          "content": [
            {
              "id": "4be77b1b-2416-4e70-a3b6-077313e5004e",
              "type": "column",
              "name": "",
              "content": [
                {
                  "id": "43a1f333-711b-4351-98b6-7c61d38db9c0",
                  "type": "heading1",
                  "name": "Heading1",
                  "content": "",
                  "placeholder": "Heading1"
                },
                {
                  "id": "f817dca0-9877-4768-9251-78c3b5e81fb9",
                  "type": "paragraph",
                  "name": "Paragraph",
                  "content": "",
                  "placeholder": "start typing here"
                }
              ],
              "className": "w-full h-full p-8 flex justify-center items-center",
              "placeholder": "Heading1"
            },
            {
              "id": "1e990230-68f8-494a-ac1d-390f7b4b1d37",
              "type": "column",
              "name": "Column",
              "content": [
                {
                  "id": "f7cc2594-1ee3-4a9e-aca2-ca6c765f0f51",
                  "type": "image",
                  "name": "Image",
                  "className": "p-3",
                  "content": "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  "alt": "Title"
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    "slideName": "Two columns",
    "type": "twoColumns",
    "className": "p-4 mx-auto flex justify-center items-center",
    "content": {
      "id": "464faba1-ef59-41a2-b465-647bff16d061",
      "type": "column",
      "name": "Column",
      "content": [
        {
          "id": "0da840ee-5842-417f-b99a-c4af62e8d937",
          "type": "title",
          "name": "Title",
          "content": "",
          "placeholder": "Untitled Card"
        },
        {
          "id": "a950369a-d8a3-4c70-8bf3-a8de4f96a400",
          "type": "resizable-column",
          "name": "Text and image",
          "className": "border",
          "content": [
            {
              "id": "ab55eb96-6441-4fb8-84a2-f0b92b4971b5",
              "type": "paragraph",
              "name": "Paragraph",
              "content": "",
              "placeholder": "Start typing..."
            },
            {
              "id": "f6ed1e0a-a51e-4bed-a5a2-256dcc20881a",
              "type": "paragraph",
              "name": "Paragraph",
              "content": "",
              "placeholder": "Start typing..."
            }
          ]
        }
      ]
    }
  },
  {
    "slideName": "Two columns with headings",
    "type": "twoColumnsWithHeadings",
    "className": "p-4 mx-auto flex justify-center items-center",
    "content": {
      "id": "b6237318-3e6f-4a54-8dfb-df4eace05a09",
      "type": "column",
      "name": "Column",
      "content": [
        {
          "id": "02cf253f-9dce-4b64-81c1-4014af1fcf0c",
          "type": "title",
          "name": "Title",
          "content": "",
          "placeholder": "Untitled Card"
        },
        {
          "id": "76b6bdbc-568b-4c3f-8702-c654ea7c8abc",
          "type": "resizable-column",
          "name": "Text and image",
          "className": "border",
          "content": [
            {
              "id": "515eb60b-f948-44d5-9999-e1a4e0a1f4e0",
              "type": "column",
              "name": "Column",
              "content": [
                {
                  "id": "ee3d1aad-2a69-43e1-b2af-3de7a48e6055",
                  "type": "heading3",
                  "name": "Heading3",
                  "content": "",
                  "placeholder": "Heading 3"
                },
                {
                  "id": "b7d837da-2dca-40ba-afb5-7a6396206728",
                  "type": "paragraph",
                  "name": "Paragraph",
                  "content": "",
                  "placeholder": "Start typing..."
                }
              ]
            },
            {
              "id": "b2294de9-f300-4971-8073-ba6e391e698e",
              "type": "column",
              "name": "Column",
              "content": [
                {
                  "id": "d8dcb29a-163f-4651-8333-340b66029753",
                  "type": "heading3",
                  "name": "Heading3",
                  "content": "",
                  "placeholder": "Heading 3"
                },
                {
                  "id": "e7a6436c-161b-49a1-ae63-4bd717cdef63",
                  "type": "paragraph",
                  "name": "Paragraph",
                  "content": "",
                  "placeholder": "Start typing..."
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    "slideName": "Three column",
    "type": "threeColumns",
    "className": "p-4 mx-auto flex justify-center items-center",
    "content": {
      "id": "223d3e06-8d4a-4864-96a3-6016a725cbc6",
      "type": "column",
      "name": "Column",
      "content": [
        {
          "id": "7bd1b000-4035-4063-8f7d-43afff492c38",
          "type": "title",
          "name": "Title",
          "content": "",
          "placeholder": "Untitled Card"
        },
        {
          "id": "cf75e681-f8f1-4a74-8ee1-a13bb6beb139",
          "type": "resizable-column",
          "name": "Text and image",
          "className": "border",
          "content": [
            {
              "id": "550bac79-8431-454a-bcea-3ad1ddf9f443",
              "type": "paragraph",
              "name": "",
              "content": "",
              "placeholder": "Start typing..."
            },
            {
              "id": "b86a88ef-ed86-4f7c-823c-4b0b1fe40450",
              "type": "paragraph",
              "name": "",
              "content": "",
              "placeholder": "Start typing..."
            },
            {
              "id": "421c41e0-ea73-4636-b4ed-caf3c6cc3d12",
              "type": "paragraph",
              "name": "",
              "content": "",
              "placeholder": "Start typing..."
            }
          ]
        }
      ]
    }
  },
  {
    "slideName": "Three columns with headings",
    "type": "threeColumnsWithHeadings",
    "className": "p-4 mx-auto flex justify-center items-center",
    "content": {
      "id": "e18a0cd8-4de4-4fab-a48f-c6a7fe208832",
      "type": "column",
      "name": "Column",
      "content": [
        {
          "id": "21ced0f1-17e9-4845-84dc-2259e80c03a7",
          "type": "title",
          "name": "Title",
          "content": "",
          "placeholder": "Untitled Card"
        },
        {
          "id": "4d85a4cc-bc4b-43c1-971a-e0eb7d558013",
          "type": "resizable-column",
          "name": "Text and image",
          "className": "border",
          "content": [
            {
              "id": "aa71e7c5-5e90-4779-94a8-1dab6739873b",
              "type": "column",
              "name": "Column",
              "content": [
                {
                  "id": "35443086-ffb4-48f1-8761-8fce2b29d122",
                  "type": "heading3",
                  "name": "Heading3",
                  "content": "",
                  "placeholder": "Heading 3"
                },
                {
                  "id": "f42cb7c4-f1a8-4188-b2b8-1e626a13f667",
                  "type": "paragraph",
                  "name": "Paragraph",
                  "content": "",
                  "placeholder": "Start typing..."
                }
              ]
            },
            {
              "id": "5e68b752-7b67-4da5-ad18-5321c37a5f50",
              "type": "column",
              "name": "Column",
              "content": [
                {
                  "id": "bc9264a4-10bf-4794-8603-a824d4ed28db",
                  "type": "heading3",
                  "name": "Heading3",
                  "content": "",
                  "placeholder": "Heading 3"
                },
                {
                  "id": "240288e3-228c-4177-b655-6af1f3b1c285",
                  "type": "paragraph",
                  "name": "Paragraph",
                  "content": "",
                  "placeholder": "Start typing..."
                }
              ]
            },
            {
              "id": "288413f7-c88f-4064-8bce-5767b81e9d96",
              "type": "column",
              "name": "Column",
              "content": [
                {
                  "id": "c19c8baf-6980-448d-b3aa-d62b5021c962",
                  "type": "heading3",
                  "name": "Heading3",
                  "content": "",
                  "placeholder": "Heading 3"
                },
                {
                  "id": "6462ddde-4982-4336-8932-8f9a652f1fc0",
                  "type": "paragraph",
                  "name": "Paragraph",
                  "content": "",
                  "placeholder": "Start typing..."
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    "slideName": "Four column",
    "type": "fourColumns",
    "className": "p-4 mx-auto flex justify-center items-center",
    "content": {
      "id": "ee04f61d-a360-49d7-9916-0388bcec71e1",
      "type": "column",
      "name": "Column",
      "content": [
        {
          "id": "e1cdb628-6035-4445-a412-7e4cefef7daa",
          "type": "title",
          "name": "Title",
          "content": "",
          "placeholder": "Untitled Card"
        },
        {
          "id": "911ae182-76c8-45c5-a482-37e575a9bff1",
          "type": "resizable-column",
          "name": "Text and image",
          "className": "border",
          "content": [
            {
              "id": "659baafe-8c4e-4123-a825-1b8f8c263a14",
              "type": "paragraph",
              "name": "Paragraph",
              "content": "",
              "placeholder": "Start typing..."
            },
            {
              "id": "d05fe24c-8394-44d7-adc7-a0624ad22bab",
              "type": "paragraph",
              "name": "Paragraph",
              "content": "",
              "placeholder": "Start typing..."
            },
            {
              "id": "020ebfb0-eadc-4abd-8f4f-21b4214619aa",
              "type": "paragraph",
              "name": "Paragraph",
              "content": "",
              "placeholder": "Start typing..."
            },
            {
              "id": "bdad14fa-889c-40e6-b750-20428af6e10f",
              "type": "paragraph",
              "name": "Paragraph",
              "content": "",
              "placeholder": "Start typing..."
            }
          ]
        }
      ]
    }
  },
  {
    "slideName": "Two Image Columns",
    "type": "twoImageColumns",
    "className": "p-4 mx-auto flex justify-center items-center",
    "content": {
      "id": "eb451276-63bc-4e69-804b-ff0ca9ebbcea",
      "type": "column",
      "name": "Column",
      "content": [
        {
          "id": "39d9a4f8-a618-4f06-b61e-730816ae2d02",
          "type": "title",
          "name": "Title",
          "content": "",
          "placeholder": "Untitled Card"
        },
        {
          "id": "bbd9bcf8-2ffb-43de-91c2-e0b599b7b125",
          "type": "resizable-column",
          "name": "Text and image",
          "className": "border",
          "content": [
            {
              "id": "6df9fef1-2c23-4040-b091-80aaba53d0b9",
              "type": "column",
              "name": "Column",
              "content": [
                {
                  "id": "b1dd15c5-9718-4ca1-bc0f-e3446eadc91a",
                  "type": "image",
                  "name": "Image",
                  "className": "p-3",
                  "content": "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  "alt": "Title"
                },
                {
                  "id": "3df172a9-49b6-4768-aeaa-bb3f9b629d27",
                  "type": "heading3",
                  "name": "Heading3",
                  "content": "",
                  "placeholder": "Heading 3"
                },
                {
                  "id": "0c37fe79-83d8-4c2f-b68a-2163f9f489fa",
                  "type": "paragraph",
                  "name": "Paragraph",
                  "content": "",
                  "placeholder": "Start typing..."
                }
              ]
            },
            {
              "id": "0c91ec12-1d46-4dc8-97ab-244db6d91963",
              "type": "column",
              "name": "Column",
              "content": [
                {
                  "id": "ea7cedbd-938b-41a3-80db-0146de7052d8",
                  "type": "image",
                  "name": "Image",
                  "className": "p-3",
                  "content": "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  "alt": "Title"
                },
                {
                  "id": "1c0dc01e-0248-43f1-8a4b-c85b62ff849c",
                  "type": "heading3",
                  "name": "Heading3",
                  "content": "",
                  "placeholder": "Heading 3"
                },
                {
                  "id": "337a80bc-2608-49f8-a607-eca417b473e5",
                  "type": "paragraph",
                  "name": "Paragraph",
                  "content": "",
                  "placeholder": "Start typing..."
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    "slideName": "Three Image Columns",
    "type": "threeImageColumns",
    "className": "p-4 mx-auto flex justify-center items-center",
    "content": {
      "id": "a01e0bfd-3f48-4927-925d-731ff07bd011",
      "type": "column",
      "name": "Column",
      "content": [
        {
          "id": "b14ba332-cd17-4547-8a5d-52858b4ee52a",
          "type": "title",
          "name": "Title",
          "content": "",
          "placeholder": "Untitled Card"
        },
        {
          "id": "e07271f7-34fd-4dd3-9fb2-c9feaaf07c54",
          "type": "resizable-column",
          "name": "Text and image",
          "className": "border",
          "content": [
            {
              "id": "a157b34b-4674-48f8-b511-5e0ed0ea0810",
              "type": "column",
              "name": "Column",
              "content": [
                {
                  "id": "aa85f349-81c1-49e2-9b28-11b30202aea1",
                  "type": "image",
                  "name": "Image",
                  "className": "p-3",
                  "content": "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  "alt": "Title"
                },
                {
                  "id": "905fca48-ef11-40fc-967b-ceceb733e99b",
                  "type": "heading3",
                  "name": "Heading3",
                  "content": "",
                  "placeholder": "Heading 3"
                },
                {
                  "id": "a4a9c5ed-b741-4fc4-b69f-04b70026b8a9",
                  "type": "paragraph",
                  "name": "Paragraph",
                  "content": "",
                  "placeholder": "Start typing..."
                }
              ]
            },
            {
              "id": "be9c7854-5da4-400f-b474-f48a3006b910",
              "type": "column",
              "name": "Column",
              "content": [
                {
                  "id": "3b52f02b-358b-4b1b-9516-379143a8ff13",
                  "type": "image",
                  "name": "Image",
                  "className": "p-3",
                  "content": "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  "alt": "Title"
                },
                {
                  "id": "a47fa710-6b83-4baa-85e3-028f4020478c",
                  "type": "heading3",
                  "name": "Heading3",
                  "content": "",
                  "placeholder": "Heading 3"
                },
                {
                  "id": "e7af4bf4-e7aa-4199-b174-42ab1cb22631",
                  "type": "paragraph",
                  "name": "Paragraph",
                  "content": "",
                  "placeholder": "Start typing..."
                }
              ]
            },
            {
              "id": "938f69c5-84d5-42ca-b119-0853a0d14ee6",
              "type": "column",
              "name": "Column",
              "content": [
                {
                  "id": "c0ed57cb-9be4-4387-ab53-b81bf3a85a25",
                  "type": "image",
                  "name": "Image",
                  "className": "p-3",
                  "content": "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  "alt": "Title"
                },
                {
                  "id": "2cb8fb89-5bbc-4ad2-bc26-f8f8cb6354b3",
                  "type": "heading3",
                  "name": "Heading3",
                  "content": "",
                  "placeholder": "Heading 3"
                },
                {
                  "id": "ca2cf57a-698f-488f-8996-d6f32116f914",
                  "type": "paragraph",
                  "name": "Paragraph",
                  "content": "",
                  "placeholder": "Start typing..."
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    "slideName": "Four Image Columns",
    "type": "fourImageColumns",
    "className": "p-4 mx-auto flex justify-center items-center",
    "content": {
      "id": "7dcfd84a-e31b-4043-9a05-8460ed0353d4",
      "type": "column",
      "name": "Column",
      "content": [
        {
          "id": "432699be-6ef7-45b7-91b7-a787e29a03fb",
          "type": "title",
          "name": "Title",
          "content": "",
          "placeholder": "Untitled Card"
        },
        {
          "id": "74a35d0d-1e9e-4e06-a05f-ba453dda93e1",
          "type": "resizable-column",
          "name": "Text and image",
          "className": "border",
          "content": [
            {
              "id": "c2203784-ed38-4532-bbf8-3b52ffd36160",
              "type": "column",
              "name": "Column",
              "content": [
                {
                  "id": "e10d0b16-52b6-4987-b774-030b8787db6f",
                  "type": "image",
                  "name": "Image",
                  "className": "p-3",
                  "content": "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  "alt": "Title"
                },
                {
                  "id": "028b52d7-9211-4b5d-b6ba-f61c41747e6b",
                  "type": "heading3",
                  "name": "Heading3",
                  "content": "",
                  "placeholder": "Heading 3"
                },
                {
                  "id": "15cdd4a2-e3f4-462e-ae2d-758e0c2b071c",
                  "type": "paragraph",
                  "name": "Paragraph",
                  "content": "",
                  "placeholder": "Start typing..."
                }
              ]
            },
            {
              "id": "9f4884e2-eb51-40d0-b470-54b35b5e055c",
              "type": "column",
              "name": "Column",
              "content": [
                {
                  "id": "520db844-b715-4f67-93c6-2824b7bf15c8",
                  "type": "image",
                  "name": "Image",
                  "className": "p-3",
                  "content": "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  "alt": "Title"
                },
                {
                  "id": "07619c12-213a-4633-a98b-6ee96fe1cda4",
                  "type": "heading3",
                  "name": "Heading3",
                  "content": "",
                  "placeholder": "Heading 3"
                },
                {
                  "id": "caf77e48-c3a2-4797-871b-9206ef8ddd42",
                  "type": "paragraph",
                  "name": "Paragraph",
                  "content": "",
                  "placeholder": "Start typing..."
                }
              ]
            },
            {
              "id": "e285ac67-952b-44bc-b508-b7f6ecfe054c",
              "type": "column",
              "name": "Column",
              "content": [
                {
                  "id": "d87b3913-4e8f-4f9f-9f19-8de065f6850f",
                  "type": "image",
                  "name": "Image",
                  "className": "p-3",
                  "content": "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  "alt": "Title"
                },
                {
                  "id": "da3d81fb-0d8e-49df-8764-069b51195add",
                  "type": "heading3",
                  "name": "Heading3",
                  "content": "",
                  "placeholder": "Heading 3"
                },
                {
                  "id": "2d1d31da-3e37-4de7-8f19-e33f221ae6d8",
                  "type": "paragraph",
                  "name": "Paragraph",
                  "content": "",
                  "placeholder": "Start typing..."
                }
              ]
            },
            {
              "id": "d977691d-95af-4e74-aa27-4cee2a93b5c5",
              "type": "column",
              "name": "Column",
              "content": [
                {
                  "id": "3c62a1e4-3679-4543-9c30-855cb9e4c0c7",
                  "type": "image",
                  "name": "Image",
                  "className": "p-3",
                  "content": "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  "alt": "Title"
                },
                {
                  "id": "a8888cc6-5f3a-4d97-8a74-fe4117913cda",
                  "type": "heading3",
                  "name": "Heading3",
                  "content": "",
                  "placeholder": "Heading 3"
                },
                {
                  "id": "10504532-34ab-4226-bf39-8cc20369dc91",
                  "type": "paragraph",
                  "name": "Paragraph",
                  "content": "",
                  "placeholder": "Start typing..."
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    "slideName": "Table Layout",
    "type": "tableLayout",
    "className": "p-8 mx-auto flex flex-col justify-center items-center min-h-[400px]",
    "content": {
      "id": "de059adb-5606-401b-9958-ffd7afbe8c58",
      "type": "column",
      "name": "Column",
      "content": [
        {
          "id": "a38b579c-5ee0-4bf4-926d-fe22fb7f8244",
          "type": "table",
          "name": "Table",
          "initialRowSizes": 2,
          "initialColumnSizes": 2,
          "content": []
        }
      ]
    }
  }
]

const generateLayoutsJson = async (outlineArray: string[]) => {
  const prompt = `### Guidelines
  You are a highly creative AI that generates JSON-based layouts for presentations. I will provide you with a pattern and a format to follow, and for each outline, you must generate unique layouts and contents and give me the output in the JSON format expected.
  Our final JSON output is a combination of layouts and elements. The available LAYOUTS TYPES are as follows: "accentLeft", "accentRight", "imageAndText", "textAndImage", "twoColumns", "twoColumnsWithHeadings", "threeColumns", "threeColumnsWithHeadings", "fourColumns", "twoImageColumns", "threeImageColumns", "fourImageColumns", "tableLayout".
  The available CONTENT TYPES are "heading1", "heading2", "heading3", "heading4", "title", "paragraph", "table", "resizable-column", "image", "blockquote", "numberedList", "bulletList", "todoList", "calloutBox", "codeBlock", "tableOfContents", "divider", "column"
  
  Use these outlines as a starting point for the content of the presentations 
    ${JSON.stringify(outlineArray)}
  
  The output must be an array of JSON objects.
    1. Write layouts based on the specific outline provided. Do not use types that are not mentioned in the example layouts.
    2. Generate layout for each layout and ensures each layout is unique for each outline.
    3. Adhere to the structure of existing layouts
    4. Fill the content property with relative to the outline provided and also fille placeholder.
    5. Generate unique image placeholders for the 'content' property of image components and also alt text according to the outline.
    6. Ensure proper formatting and schema alignment for the output JSON.
  7. First create LAYOUTS TYPES  at the top most level of the JSON output as follows ${JSON.stringify(
    [
      {
        slideName: "Blank card",
        type: "blank-card",
        className:
          "p-8 mx-auto flex justify-center items-center min-h-[200px]",
        content: {},
      },
    ]
  )}
  
  8.The content property of each LAYOUTS TYPE should start with “column” and within the columns content property you can use any  of the CONTENT TYPES I provided above. Resizable-column, column and other multi element contents should be an array because you can have more elements inside them nested. Static elements like title and paragraph should have content set to a string.Here is an example of what 1 layout with 1 column with 1 title inside would look like:
  ${JSON.stringify([
    {
      slideName: "Blank card",
      type: "blank-card",
      className: "p-8 mx-auto flex justify-center items-center min-h-[200px]",
      content: {
        id: uuidv4(),
        type: "column" as ContentType,
        name: "Column",
        content: [
          {
            id: uuidv4(),
            type: "title" as ContentType,
            name: "Title",
            content: "",
            placeholder: "Untitled Card",
          },
        ],
      },
    },
  ])}
  
  
  9. Here is a final example of an example output for you to get an idea 
  ${JSON.stringify(existingLayouts)}
  
   For Images 
    - The alt text should describe the image clearly and concisely.
    - Focus on the main subject(s) of the image and any relevant details such as colors, shapes, people, or objects.
    - Ensure the alt text aligns with the context of the presentation slide it will be used on (e.g., professional, educational, business-related).
    - Avoid using terms like "image of" or "picture of," and instead focus directly on the content and meaning.
    - use placehold.co for image src donot use any unsplash for any free image from anywhere.
  
    Output the layouts in JSON format. Ensure there are no duplicate layouts across the array.
  `;

  try {
    const result = await layoutGenerationSession.sendMessage(prompt)
    const jsonResponse = JSON.parse(result.response.text())

    if (!jsonResponse || jsonResponse.length === 0) {
      return { status: 400, message: "No layouts generated" }
    }

    return {
      status: 200,
      data: jsonResponse
    }

  } catch (error) {
    console.error("🔴 ERROR: ", error)
    return { status: 500, message: "Error generating layouts" }
  }

}


export const generateLayouts = async (theme: string, projectId: string) => {
  try {
    if (!projectId) {
      return { status: 400, error: "Project ID is required" }
    }
    const user = await currentUser()
    if (!user) {
      return { status: 403, error: "User not authenticated" }
    }
    const userExists = await client.user.findUnique({
      where: {
        clerkId: user.id
      }
    })
    if (!userExists || !userExists.subscription) {
      return {
        status: 403, error: !userExists?.subscription ?
          "User does not have a subscription" :
          "User does not exist"
      }
    }

    const project = await client.project.findUnique({
      where: {
        id: projectId,
        isDeleted: false
      }
    })

    if (!project) {
      return { status: 404, error: "Project not found" }
    }

    if (!project.outlines || project.outlines.length === 0) {
      return { status: 400, error: "Project does not have any outlines" }
    }

    const layouts = await generateLayoutsJson(project.outlines)

    if (layouts.status !== 200) {
      return layouts
    }

    await client.project.update({
      where: {
        id: projectId
      },
      data: {
        slides: layouts.data,
        themeName: theme
      }
    })

    return { status: 200, data: layouts.data }

  } catch (error) {
    console.error("🔴 ERROR: ", error)
    return { status: 500, error: "Internal server error.", data: [] }
  }
}


//image generation functions
export const generateImages = async (slides: Slide[]) => {
  try {
    console.log("🟢 Generating images for slides...");

    // Create a deep clone to preserve original data
    const slidesCopy: Slide[] = JSON.parse(JSON.stringify(slides));

    // Process cloned slides
    const processedSlides = await Promise.all(
      slidesCopy.map(async (slide) => {
        const updatedContent = await processSlideContent(slide.content);
        return { ...slide, content: updatedContent };
      })
    );

    console.log("🟢 Images generated successfully");
    return { status: 200, data: processedSlides };
  } catch (error) {
    console.error("🔴 ERROR:", error);
    return { status: 500, error: "Internal server error" };
  }
};

const processSlideContent = async (content: ContentItem): Promise<ContentItem> => {
  // Create a deep clone of the content structure
  const contentClone: ContentItem = JSON.parse(JSON.stringify(content));
  const imageComponents = findImageComponents(contentClone);

  // Process images in parallel while maintaining structure
  await Promise.all(
    imageComponents.map(async (component, index) => {
      // limiting to only 3 images per project - gemini p
      if (index > 1) {
        component.content = "https://plus.unsplash.com/premium_vector-1721386085379-8df3c43a062d";
      }
      try {
        const newUrl = await generateImageUrl(component.alt || "Placeholder Image");
        component.content = newUrl;
      } catch (error) {
        console.error("🔴 Image generation failed:", error);
        component.content = "https://plus.unsplash.com/premium_vector-1721386085379-8df3c43a062d";
      }
    })
  );

  return contentClone;
};

const findImageComponents = (layout: ContentItem): ContentItem[] => {
  const images: ContentItem[] = [];

  const traverse = (node: ContentItem) => {
    if (node.type === "image") {
      images.push(node);
    }

    if (Array.isArray(node.content)) {
      node.content.forEach(child => traverse(child as ContentItem));
    } else if (typeof node.content === "object" && node.content !== null) {
      traverse(node.content);
    }
  };

  traverse(layout);
  return images;
};

const generateImageUrl = async (prompt: string): Promise<string> => {
  try {
  const improvedPrompt = `
  Create a highly realistic, professional image based on the following description. The image should look as if captured in real life, with attention to detail, lighting, and texture. 

  Description: ${prompt}
  
  Important Notes:
  - The image must be in a photorealistic style and visually compelling.
  - Ensure all text, signs, or visible writing in the image are in English.
  - Pay special attention to lighting, shadows, and textures to make the image as lifelike as possible.
  - Avoid elements that appear abstract, cartoonish, or overly artistic. The image should be suitable for professional presentations.
  - Focus on accurately depicting the concept described, including specific objects, environment, mood, and context. Maintain relevance to the description provided.
  
  Example Use Cases: Business presentations, educational slides, professional designs.
  `;
  const cdnUrl = await generateImageWithGeiminiTest(improvedPrompt)
    return `${cdnUrl}-/preview/`

  } catch (error: any) {
    console.error("Failed to generate image:", error.message);
    return "https://plus.unsplash.com/premium_vector-1721386085379-8df3c43a062d";
  }
};

// const generateImageUrl = async (prompt: string): Promise<string> => {
//   try {
//   const improvedPrompt = `
//   Create a highly realistic, professional image based on the following description. The image should look as if captured in real life, with attention to detail, lighting, and texture. 

//   Description: ${prompt}
  
//   Important Notes:
//   - The image must be in a photorealistic style and visually compelling.
//   - Ensure all text, signs, or visible writing in the image are in English.
//   - Pay special attention to lighting, shadows, and textures to make the image as lifelike as possible.
//   - Avoid elements that appear abstract, cartoonish, or overly artistic. The image should be suitable for professional presentations.
//   - Focus on accurately depicting the concept described, including specific objects, environment, mood, and context. Maintain relevance to the description provided.
  
//   Example Use Cases: Business presentations, educational slides, professional designs.
//   `;
//   const { buffer, fileName } = await generateImageWithGeimini(improvedPrompt)
//   const imageBlob = new Blob([buffer], { type: 'image/png' });

//   console.log("🟢 Image generated successfully:");

//     const file = await uploadFile(imageBlob, {
//       publicKey: process.env.UPLOADCARE_PUBLIC_KEY!,
//       fileName: fileName,
//     });
//     // console.log(file);

//     console.log("🟢 Image uploaded to Uploadcare");
//     return file?.cdnUrl

//   } catch (error: any) {
//     console.error("Failed to generate image:", error.message);
//     return "https://plus.unsplash.com/premium_vector-1721386085379-8df3c43a062d";
//   }
// };