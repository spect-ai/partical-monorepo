export default async function handler(req, res) {
  const serverRes = await fetch('http://137.184.32.138:3000/createCustom', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      serverId: req.body.serverId,
      githubRepo: req.body.githubRepo,
    }),
  });
  console.log(await serverRes.text());
  //   if (serverRes.ok) {
  //     //   const data = await serverRes.json();
  //     res.status(200);
  //   }
  res.status(200).json({ ok: true });
}
