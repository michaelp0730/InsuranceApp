import { ChangeEvent, Dispatch, SetStateAction } from "react";
import Vehicle from "../interfaces/Vehicle";

interface VehiclesProps {
  vehicles: Vehicle[];
  setVehicles: Dispatch<SetStateAction<Vehicle[]>>;
}

const Vehicles: React.FC<VehiclesProps> = ({ vehicles, setVehicles }) => {
  const addVehicle = () => {
    setVehicles((prev) => [...prev, { vin: "", year: 2025, makeModel: "" }]);
  };

  const handleVehicleChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setVehicles((prev) =>
      prev.map((vehicle, i) =>
        i === index
          ? {
              ...vehicle,
              [name]: name === "year" ? Number(value) : value,
            }
          : vehicle
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
            <div key={`card-${index}`} className="card p-3 my-3">
              <p>
                <label>VIN:</label>
                <br />
                <input
                  type="text"
                  name="vin"
                  value={vehicle.vin}
                  onChange={(e) => handleVehicleChange(index, e)}
                />
              </p>
              <p>
                <label>Year:</label>
                <br />
                <input
                  type="number"
                  name="year"
                  value={vehicle.year}
                  onChange={(e) => handleVehicleChange(index, e)}
                />
              </p>
              <p>
                <label>Make &amp; Model:</label>
                <br />
                <input
                  type="text"
                  name="makeModel"
                  value={vehicle.makeModel}
                  onChange={(e) => handleVehicleChange(index, e)}
                />
              </p>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => deleteVehicle(index)}
              >
                Delete Vehicle
              </button>
            </div>
          </div>
        ))}
      </div>
      {!vehicles ||
        (vehicles.length < 3 && (
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={addVehicle}
          >
            Add Vehicle
          </button>
        ))}
    </fieldset>
  );
};

export default Vehicles;
