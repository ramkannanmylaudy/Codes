import connectMongo from "@/utils/connectMongo";
import UserModel from "@/models/userModel";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();
        await connectMongo();

        //check user already exist
        const userCheck = await UserModel.findOne({email: email});
        if(userCheck){
            return Response.json({ status: 'error', message: 'User already exists!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const data = { name, email, password: hashedPassword };        
        await UserModel.create(data);
        return Response.json({ status: 'success', message: 'User Registered!' });
    } catch (error) {
        return Response.json({ status: 'error', message: error._message })
    }
}