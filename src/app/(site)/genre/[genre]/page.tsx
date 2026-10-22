import {Catalog} from "@/components/catalog";
export const dynamic='force-dynamic';
type Props={params:Promise<{genre:string}>;searchParams:Promise<{page?:string;q?:string}>};
export async function generateMetadata({params}:Props){const{genre}=await params;return{title:genre,alternates:{canonical:`/genre/${encodeURIComponent(genre)}`}};}
export default async function Page({params,searchParams}:Props){const{genre}=await params;return <Catalog title={genre} genre={genre} base={`/genre/${encodeURIComponent(genre)}`} searchParams={searchParams}/>;}
