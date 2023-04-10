import crypto from "node:crypto"

import { getMaintainersHandler } from "./getMaintainersHandler"

describe("getMaintainersHandler", () => {
  it("returns 400 with invalid uuid", async () => {
    const getClient = jest.fn(() => ({
      request: <T>() => Promise.resolve() as Promise<T>,
    }))

    const r = await getMaintainersHandler(getClient())([])("invalid uuid")()
    expect(r.status).toBe(400)
  })

  it("returns 500 if api request fails", async () => {
    const getClient = jest.fn(() => ({
      request: <T>() => Promise.reject() as Promise<T>,
    }))

    const r = await getMaintainersHandler(getClient())([])(crypto.randomUUID())()
    expect(r.status).toBe(500)
  })

  it("returns 500 if adapter fails", async () => {
    const getClient = jest.fn(() => ({
      request: <T>() =>
        Promise.resolve({
          view: {
            responsibilities: [
              {
                users: [
                  {
                    userId: crypto.randomUUID(),
                    userCreatedAt: "invalid date",
                    userUpdatedAt: "invalid date",
                  },
                ],
              },
            ],
          },
        }) as Promise<T>,
    }))

    const r = await getMaintainersHandler(getClient())([])(crypto.randomUUID())()

    expect(r.status).toBe(500)
    expect(r.value).toBeInstanceOf(Error)
    expect((r.value as Error).message).toBe("Unable to process responsibility data from Collibra")
  })

  it("returns 200", async () => {
    const getClient = jest.fn(() => ({
      request: <T>() =>
        Promise.resolve({
          view: {
            responsibilities: [
              {
                users: [
                  {
                    userId: crypto.randomUUID(),
                    userCreatedAt: new Date().valueOf(),
                    userUpdatedAt: new Date().valueOf(),
                    userEmail: "name@exmaple.com",
                    userFirstName: "Name",
                    userLastName: "Nameson",
                  },
                ],
                roles: [
                  {
                    roleId: crypto.randomUUID(),
                    roleCreatedAt: new Date().valueOf(),
                    roleUpdatedAt: new Date().valueOf(),
                    roleName: "Role Name",
                  },
                ],
                assets: [{ assetId: crypto.randomUUID() }],
              },
            ],
          },
        }) as Promise<T>,
    }))

    const r = await getMaintainersHandler(getClient())([])(crypto.randomUUID())()

    expect(r.status).toBe(200)
    expect((r.value as Array<unknown>).length).toBeGreaterThan(0)
  })
})
