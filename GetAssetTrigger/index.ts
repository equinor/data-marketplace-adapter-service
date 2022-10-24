import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios from "axios";
import {config} from "../config";

const GetAssetTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const { id } = context.bindingData

    const collibraAssetRes = axios.get(`${config.COLLIBRA_BASE_URL}/${id}`)
    context.log("[GetAssetTrigger] id", id)

    context.res = {
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({message: "Hello, World"})
    };

};

export default GetAssetTrigger;