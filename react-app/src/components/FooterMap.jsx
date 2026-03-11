export default function FooterMap() {
  const placeQuery = encodeURIComponent("Collier County, FL");

  return (
    <section className="py-5 main_sec">
      <div className="container text-center">

        <h2 className="fw-bold text-white mb-3">
          Housing Resources Near You
        </h2>

        <p className="text-white mb-4">
          Explore affordable housing opportunities across Collier County.
        </p>

        <div className="glass-card overflow-hidden">
          <iframe
            title="Map"
            src={`https://www.google.com/maps?q=${placeQuery}&output=embed`}
            width="100%"
            height="350"
            style={{ border: 0 }}
            loading="lazy"
          />
        </div>

      </div>
    </section>
  );
}