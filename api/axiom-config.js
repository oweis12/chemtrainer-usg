export default function handler(req,res){
  res.setHeader("Cache-Control","no-store");
  res.setHeader("X-Content-Type-Options","nosniff");
  if(req.method!=="GET"){res.setHeader("Allow","GET");return res.status(405).json({enabled:false});}
  const url=(process.env.AXIOM_SUPABASE_URL||"").trim().replace(/\/$/,"");
  const key=(process.env.AXIOM_SUPABASE_PUBLISHABLE_KEY||"").trim();
  const validUrl=/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url);
  const validKey=/^(sb_publishable_[A-Za-z0-9_-]+|eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/.test(key);
  if(!validUrl||!validKey)return res.status(200).json({enabled:false});
  return res.status(200).json({enabled:true,url,key});
}
