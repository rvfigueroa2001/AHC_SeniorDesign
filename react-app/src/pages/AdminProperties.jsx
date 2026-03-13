import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const PROPERTY_LIST_KEYS = ["properties", "results", "data", "items", "listings", "rows"];

function buildApiUrl(path) {
  const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

function parseJsonValue(value) {
  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function normalizePayload(payload) {
  const parsedPayload = parseJsonValue(payload);

  if (Array.isArray(parsedPayload)) {
    return parsedPayload;
  }

  if (!parsedPayload || typeof parsedPayload !== "object") {
    return [];
  }

  if (parsedPayload.body !== undefined) {
    return normalizePayload(parsedPayload.body);
  }

  for (const key of PROPERTY_LIST_KEYS) {
    if (Array.isArray(parsedPayload[key])) {
      return parsedPayload[key];
    }

    if (parsedPayload[key] && typeof parsedPayload[key] === "object") {
      const nestedResult = normalizePayload(parsedPayload[key]);
      if (nestedResult.length > 0) {
        return nestedResult;
      }
    }
  }

  if (parsedPayload.property_id || parsedPayload.id) {
    return [parsedPayload];
  }

  return [];
}

function createFormState(property) {
  return {
    property_name: property.property_name || property.name || "",
    address: property.address || "",
    city: property.city || "",
    zip_code: property.zip_code || property.zip || "",
    bedrooms: property.bedrooms ?? "",
    bathrooms: property.bathrooms ?? "",
    rent: property.rent ?? property.monthly_rent ?? "",
    ami_limit_percent: property.ami_limit_percent ?? property.ami ?? "",
    contact_email: property.contact_email || "",
    contact_phone: property.contact_phone || "",
  };
}

function AdminProperties() {
  const { getAccessToken } = useAuth();
  const [properties, setProperties] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      setError("");

      try {
        const token = await getAccessToken();
        const response = await fetch(buildApiUrl("/admin/properties"), {
            method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const message = await response.text().catch(() => "");
          throw new Error(message || `Unable to load properties (${response.status}).`);
        }

        const payload = await response.json();
        const list = normalizePayload(payload);
        setProperties(list);

        if (list.length > 0) {
          const firstProperty = list[0];
          const firstId = firstProperty.property_id ?? firstProperty.id;
          setSelectedId(firstId);
          setFormData(createFormState(firstProperty));
        }
      } catch (err) {
        setError(err?.message || "Unable to load admin properties.");
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [getAccessToken]);

  const selectedProperty = properties.find(
    (property) => (property.property_id ?? property.id) === selectedId
  );

  const handleSelect = (property) => {
    const propertyId = property.property_id ?? property.id;
    setSelectedId(propertyId);
    setFormData(createFormState(property));
    setStatus("");
    setError("");
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!selectedId || !formData) {
      return;
    }

    setSaving(true);
    setError("");
    setStatus("");

    try {
      const token = await getAccessToken();
      const response = await fetch(buildApiUrl(`/admin/properties/${selectedId}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          bedrooms: formData.bedrooms === "" ? null : Number(formData.bedrooms),
          bathrooms: formData.bathrooms === "" ? null : Number(formData.bathrooms),
          rent: formData.rent === "" ? null : Number(formData.rent),
          ami_limit_percent:
            formData.ami_limit_percent === "" ? null : Number(formData.ami_limit_percent),
        }),
      });

      if (!response.ok) {
        const message = await response.text().catch(() => "");
        throw new Error(message || `Unable to save property (${response.status}).`);
      }

      const updatedProperty = {
        ...selectedProperty,
        ...formData,
      };

      setProperties((current) =>
        current.map((property) => {
          const propertyId = property.property_id ?? property.id;
          return propertyId === selectedId ? updatedProperty : property;
        })
      );
      setStatus("Property saved.");
    } catch (err) {
      setError(err?.message || "Unable to save property.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="container py-5">
      <div className="mb-4">
        <h2 className="mb-2">Admin Property Editor</h2>
        <p className="mb-0 text-muted">
          Review the current property list from the protected admin API and update details below.
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {status && <div className="alert alert-success">{status}</div>}

      <Row className="g-4">
        <Col lg={4}>
          <Card className="h-100">
            <Card.Body>
              <h3 className="h5 mb-3">Properties</h3>
              {loading ? (
                <p className="mb-0 text-muted">Loading properties...</p>
              ) : properties.length === 0 ? (
                <p className="mb-0 text-muted">No properties were returned from /admin/properties.</p>
              ) : (
                <div className="d-grid gap-2">
                  {properties.map((property) => {
                    const propertyId = property.property_id ?? property.id;
                    const isSelected = propertyId === selectedId;
                    return (
                      <Button
                        key={propertyId}
                        variant={isSelected ? "primary" : "outline-secondary"}
                        className="text-start"
                        onClick={() => handleSelect(property)}
                      >
                        <div className="fw-semibold">
                          {property.property_name || property.name || `Property ${propertyId}`}
                        </div>
                        <div className="small opacity-75">{property.address || "No address"}</div>
                      </Button>
                    );
                  })}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card>
            <Card.Body>
              <h3 className="h5 mb-3">Edit Selected Property</h3>
              {!formData ? (
                <p className="mb-0 text-muted">Select a property to edit.</p>
              ) : (
                <Form onSubmit={handleSave}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Property Name</Form.Label>
                        <Form.Control
                          name="property_name"
                          value={formData.property_name}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>City</Form.Label>
                        <Form.Control name="city" value={formData.city} onChange={handleChange} />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control name="address" value={formData.address} onChange={handleChange} />
                  </Form.Group>

                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Zip Code</Form.Label>
                        <Form.Control
                          name="zip_code"
                          value={formData.zip_code}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Bedrooms</Form.Label>
                        <Form.Control
                          type="number"
                          name="bedrooms"
                          value={formData.bedrooms}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Bathrooms</Form.Label>
                        <Form.Control
                          type="number"
                          step="0.5"
                          name="bathrooms"
                          value={formData.bathrooms}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Rent</Form.Label>
                        <Form.Control
                          type="number"
                          step="0.01"
                          name="rent"
                          value={formData.rent}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>AMI Limit Percent</Form.Label>
                        <Form.Control
                          type="number"
                          name="ami_limit_percent"
                          value={formData.ami_limit_percent}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Contact Phone</Form.Label>
                        <Form.Control
                          name="contact_phone"
                          value={formData.contact_phone}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>Contact Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="contact_email"
                      value={formData.contact_email}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-end">
                    <Button type="submit" disabled={saving}>
                      {saving ? "Saving..." : "Save Property"}
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </section>
  );
}

export default AdminProperties;