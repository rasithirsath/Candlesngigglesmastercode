import { useEffect, useState } from "react";

const Reviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("https://backend-wghd.onrender.com/api/reviews/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("REVIEWS DATA:", data);

        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          setReviews([]);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl text-primary mb-6">My Reviews</h2>

      {reviews.length === 0 && (
        <p className="text-foreground/60">No reviews yet.</p>
      )}

      {reviews.map((r) => (
        <div key={r._id} className="border p-4 mb-4">
          <p>{"★".repeat(r.rating)}</p>
          <p>{r.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default Reviews;
