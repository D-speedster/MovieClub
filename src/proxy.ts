import {NextRequest,NextResponse} from 'next/server';
export function proxy(request:NextRequest){
 const pathname=request.nextUrl.pathname;
 const mapping:Record<string,string>={'/Movies':'/movies','/Series':'/series','/Anime':'/anime','/Categories':'/categories'};
 const destination=mapping[pathname] || (pathname.startsWith('/Movie/')?'/movie/'+pathname.slice('/Movie/'.length):undefined);
 if(destination){const url=request.nextUrl.clone();url.pathname=destination;return NextResponse.redirect(url,308);}
 return NextResponse.next();
}
export const config={matcher:['/((?!api|_next|uploads|img|fonts).*)']};
