import crypto from "node:crypto"

import { getTermsHandler } from "./getTermsHandler"

describe("getTermsHandler", () => {
  it("responds with 400 with invalid asset ID", async () => {
    const getClient = jest.fn(() => ({
      request: <T>() => Promise.resolve() as Promise<T>,
    }))

    const res = await getTermsHandler(getClient())("invalid uuid")()
    expect(res.status).toBe(400)
  })

  it("responds with 500 if call to Collibra fails", async () => {
    const getClient = jest.fn(() => ({
      request: <T>() => Promise.reject() as Promise<T>,
    }))

    const res = await getTermsHandler(getClient())(crypto.randomUUID())()
    expect(res.status).toBe(500)
  })

  it("responds with 500 if adapter fails", async () => {
    const getClient = jest.fn(() => ({
      request: <T>() => Promise.resolve({ view: { assets: [] } }) as Promise<T>,
    }))

    const res = await getTermsHandler(getClient())(crypto.randomUUID())()
    expect(res.status).toBe(500)
    expect(res.value).toBeInstanceOf(Error)
    expect((res.value as Error).message).toBe("Unable to convert data from Collibra")
  })

  it("responds with 200", async () => {
    const getClient = jest.fn(() => ({
      request: <T>() =>
        Promise.resolve({
          view: {
            assets: [
              {
                id: "a761de3b-5b12-4285-8a9c-a49b07b24116",
                relations: [
                  {
                    targetAssets: [
                      {
                        targetAssetId: "4124ad7f-0b0c-443e-8eb7-6a9d9a9ac5a0",
                        targetAssetName: "Some target asset",
                        targetAssetCreatedAt: 1649499543302,
                        targetAssetUpdatedAt: 1664413126593,
                        targetAssetTypes: [
                          {
                            targetAssetTypeName: "Rights-to-Use",
                          },
                        ],
                        targetAssetAttributes: [
                          {
                            targetAssetAttributeValue: "https://flustered-elephant.com",
                            targetAssetAttributeTypes: [
                              {
                                targetAssetAttributeId: "3e0732e8-d6b2-4af9-8788-adf7136ba7ab",
                                targetAssetAttributeTypeName: "Authorization URL",
                                targetAssetAttributeTypeCreatedAt: 1669553276413,
                                targetAssetAttributeTypeUpdatedAt: 1660531381641,
                              },
                            ],
                          },
                          {
                            targetAssetAttributeValue:
                              "<div><p>Nihil nemo dicta corporis impedit ratione id nobis.</p><p>Beatae ex quisquam doloremque.</p><p>Earum voluptates voluptas dolorum vero adipisci officia dolorum aperiam officiis.</p><p>Sequi ipsam vero officiis culpa sapiente unde aspernatur.</p><p>Natus ipsa veritatis laborum tempore iste nisi.</p></div>",
                            targetAssetAttributeTypes: [
                              {
                                targetAssetAttributeId: "173d3d0c-df39-44fb-99fa-9f63d0d5e201",
                                targetAssetAttributeTypeName: "Terms and Conditions",
                                targetAssetAttributeTypeCreatedAt: 1663679082872,
                                targetAssetAttributeTypeUpdatedAt: 1658474892238,
                              },
                            ],
                          },
                          {
                            targetAssetAttributeValue: "Reprehenderit numquam quasi.",
                            targetAssetAttributeTypes: [
                              {
                                targetAssetAttributeId: "989d2471-4638-4c97-8f02-fd70a9a89fd9",
                                targetAssetAttributeTypeName: "Description",
                                targetAssetAttributeTypeCreatedAt: 1675580801676,
                                targetAssetAttributeTypeUpdatedAt: 1663596683430,
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        }) as Promise<T>,
    }))

    const res = await getTermsHandler(getClient())(crypto.randomUUID())()
    expect(res.status).toBe(200)
  })
})
