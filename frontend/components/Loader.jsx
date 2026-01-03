export default function Loader({ text = "Loading..." }) {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <p style={{ fontWeight: "bold" }}>{text}</p>
    </div>
  );
}
