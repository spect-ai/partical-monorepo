export default async function handler(req, res) {
  const serverRes = await fetch('http://137.184.32.138:3000/createServer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      serverId: '1',
    }),
  });
  console.log(await serverRes.text());
  //   if (serverRes.ok) {
  //     //   const data = await serverRes.json();
  //     res.status(200);
  //   }
  res.status(200).json({ ok: true });
}
