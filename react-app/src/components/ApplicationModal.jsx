import React, { useEffect, useState } from "react";
export default function ApplicationModal({ show, handleClose }) {
  const [step, setStep] = useState(1);
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [householdSize, setHouseholdSize] = useState("");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!show) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // cleanup al cerrar modal / desmontar
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [show]);

  const API =
    import.meta.env.VITE_API_URL ||
    "https://s7j75213rh.execute-api.us-east-1.amazonaws.com/match";

  const submit = async () => {
    // ✅ Abre la pestaña INMEDIATAMENTE por el gesto del usuario (evita popup blocker)
    const newTab = window.open("/results", "_blank");

    setLoading(true);
    console.log("ApplicationModal: submit started", { monthlyIncome, householdSize });

    try {
      const payload = {
        household_income: Number(monthlyIncome) * 12,
        household_size: Number(householdSize),
      };

      console.log("Sending payload:", payload);

      const resp = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Fetch response status:", resp.status);

      if (!resp.ok) {
        const errorText = await resp.text().catch(() => "");
        throw new Error(`API error ${resp.status} ${errorText}`);
      }

      let data = await resp.json();
      console.log("Response json:", data);

      // si tu lambda envuelve body como string
      if (data && data.body) {
        try {
          data = JSON.parse(data.body);
        } catch (e) {
          console.warn("No se pudo parsear data.body:", e);
        }
      }

      // guarda los resultados donde tu /results los lea
      localStorage.setItem("housingResults", JSON.stringify(data));
      console.log("Saved housingResults to localStorage");

      // ✅ cierra modal
      handleClose?.();

      // ✅ asegura que la pestaña vaya a /results (por si acaso)
      if (newTab) newTab.location.href = "/results";
    } catch (err) {
      console.error("Error en submit:", err);

      // si algo falla, opcionalmente cierra la pestaña abierta
      if (newTab) newTab.close();

      alert("Error al verificar elegibilidad. Revisa la consola para más detalles.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      {/* ✅ Backdrop debajo del modal */}
      <div
        className="modal-backdrop show"
        style={{ zIndex: 1050 }}
        onClick={handleClose} // click afuera cierra (si no lo quieres, borra esta línea)
      />

      {/* ✅ Modal arriba del backdrop */}
      <div
        className="modal show d-block"
        role="dialog"
        aria-modal="true"
        style={{ zIndex: 1055 }}
        onClick={handleClose} // permite cerrar si haces click en el “overlay” (fuera del diálogo)
      >
        <div
          className="modal-dialog modal-dialog-centered"
          onClick={(e) => e.stopPropagation()} // ✅ evita que clicks dentro cierren el modal
        >
          <div className="modal-content p-3">
            <div className="modal-header">
              <h5 className="modal-title">Eligibility Check</h5>
              <button
                className="btn-close"
                onClick={handleClose}
                aria-label="Close"
                type="button"
              />
            </div>

            <div className="modal-body">
              {step === 1 && (
                <>
                  <label className="form-label">Monthly income</label>
                  <input
                    className="form-control mb-3"
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                  />

                  <button
                    className="btn btn-primary w-100"
                    onClick={() => setStep(2)}
                    disabled={!monthlyIncome}
                    type="button"
                  >
                    Next
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <label className="form-label">Household size</label>
                  <input
                    className="form-control mb-3"
                    type="number"
                    value={householdSize}
                    onChange={(e) => setHouseholdSize(e.target.value)}
                  />

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setStep(1)}
                      type="button"
                    >
                      Back
                    </button>

                    <button
                      className="btn btn-success w-100"
                      onClick={submit}
                      disabled={loading || !householdSize}
                      type="button"
                    >
                      {loading ? "Checking..." : "Check Eligibility"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}