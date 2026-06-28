"use client";

interface Post {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
  sentiment: string;
  url: string;
}

interface Props {
  data: Post[];
}

export default function TopPostsTable({ data }: Props) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold">Top Videos</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-3">Video</th>
              <th>Channel</th>
              <th className="text-right">Views</th>
              <th className="text-right">Comments</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-4">
                  <div className="flex gap-3 py-2">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-16 w-28 rounded-lg object-cover"
                    />

                    <div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-blue-600"
                      >
                        {item.title}
                      </a>

                      <div className="mt-1 text-xs text-gray-500">
                        {item.sentiment}
                      </div>
                    </div>
                  </div>
                </td>

                <td>{item.author}</td>

                <td className="text-right">{item.views.toLocaleString()}</td>

                <td className="text-right">{item.comments.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <div className="py-10 text-center text-gray-400">Tidak ada data</div>
        )}
      </div>
    </div>
  );
}
