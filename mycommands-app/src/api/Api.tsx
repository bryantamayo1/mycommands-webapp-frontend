import { SessionStorage } from "../utils/SessionStorage";

export abstract class Api {
    static async get<T>(path: string): Promise<T>{
        const user = SessionStorage.getItem("user");
        const resp = await fetch(process.env.REACT_APP_API_URL + path, 
            {
                headers: {
                    xen: "Bearer " + user.xen,
                },
                method: "GET"
            });
        if(resp.ok){
            return await resp.json();
        }else{
            throw await resp.json();
        }
    }
}