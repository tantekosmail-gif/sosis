"use client";

interface Post {
  id: number;
  author: string;
  platform: string;
  engagement: number;
  sentiment: string;
  content: string;
}

interface Props {
  data: Post[];
}

export default function TopPostsTable({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-5">Top Posts</h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Author</th>

            <th>Platform</th>

            <th>Sentiment</th>

            <th>Engagement</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={Math.random()} className="border-b hover:bg-gray-50">
              <td className="py-3">
                <div className="font-medium">{item.author}</div>

                <div className="text-gray-500 text-xs">{item.content}</div>
              </td>

              <td className="text-center">{item.platform}</td>

              <td className="text-center capitalize">{item.sentiment}</td>

              <td className="text-center">
                {item.engagement?.toLocaleString() ?? "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
