import React from "react";
import Vehicle from "../interfaces/Vehicle";

interface VehiclesProps {
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  errors: string[][];
}

const Vehicles: React.FC<VehiclesProps> = ({
  vehicles,
  setVehicles,
  errors,
}) => {
  const addVehicle = () => {
    setVehicles((prev) => [...prev, { vin: "", year: 0, makeModel: "" }]);
  };

  const handleVehicleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setVehicles((prev) =>
      prev.map((vehicle, i) =>
        i === index ? { ...vehicle, [name]: value } : vehicle
      )
    );
  };

  const deleteVehicle = (index: number) => {
    setVehicles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <fieldset className="mt-5">
      <h2 className="display-6">Vehicles</h2>
      <div className="row">
        {vehicles.map((vehicle, index) => (
          <div className="col-lg-4" key={`col-${index}`}>
            <div className="card p-3 my-2" key={`card-${index}`}>
              <div className="row">
                <div className="my-3">
                  <label>VIN:</label>
                  <br />
                  <input
                    type="text"
                    name="vin"
                    value={vehicle.vin}
                    onChange={(e) => handleVehicleChange(index, e)}
                  />
                  {errors[index] &&
                    errors[index].map((error, i) => (
                      <p key={i} className="text-danger">
                        <small>{error}</small>
                      </p>
                    ))}
                </div>
                <div className="my-2">
                  <label>Year:</label>
                  <br />
                  <input
                    type="number"
                    name="year"
                    value={vehicle.year || ""}
                    onChange={(e) => handleVehicleChange(index, e)}
                  />
                </div>
                <div className="my-2">
                  <label>Make & Model:</label>
                  <br />
                  <input
                    type="text"
                    name="makeModel"
                    value={vehicle.makeModel}
                    onChange={(e) => handleVehicleChange(index, e)}
                  />
                </div>
              </div>
              <button
                type="button"
                className="btn btn-danger mt-2"
                onClick={() => deleteVehicle(index)}
              >
                Remove Vehicle
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-outline-primary mt-3"
        onClick={addVehicle}
      >
        Add Vehicle
      </button>
    </fieldset>
  );
};

export default Vehicles;
