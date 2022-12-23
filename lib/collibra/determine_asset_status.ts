import * as E from "fp-ts/Either"

/**
 * Determines if a given Collibra Asset's status is the expected status.
 * @param statusName The name of the Collibra status to compare agains
 * @returns {(asset: Collibra.Asset) => E.Either<Collibra.Asset, Error>}
 */
export const determineAssetStatus = (statusName: string) => (asset: Collibra.Asset) =>
  statusName.toLowerCase() !== asset.status.name.toLowerCase()
    ? E.left(new Error(`Expected ${asset.id} to have status ${statusName}, but got ${asset.status}`))
    : E.right(asset)
