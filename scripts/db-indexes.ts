import {connectDB} from '../src/lib/db';
import * as models from '../src/server/models';
import mongoose from 'mongoose';
async function main(){try{await connectDB();for(const model of Object.values(models)){await model.createIndexes();console.log(`${model.modelName}: indexes ready`);}}finally{await mongoose.disconnect();}}
main().catch(error=>{console.error(error);process.exitCode=1;});
