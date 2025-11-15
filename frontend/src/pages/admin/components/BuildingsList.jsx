import "./component-styles/BuildingsList.css"

const BuildingsList = ({ buildings, getApartments, selectedBuilding }) => {

    return(
        <div className="buildings-list">
            {buildings.map(building => (
                <button
                    key={building.id}
                    className={`building-item ${selectedBuilding?.id === building.id ? 'selected' : ''}`}
                    onClick={() => getApartments(building.id)}
                >
                    <div className="building-info">
                        <div className="building-name">Building {building.buildingNumber}</div>
                        <div className="building-address"><h4>{building.address}</h4></div>
                        <div className="building-apartments">{building.numberOfApartments} apartments</div>
                    </div>
                </button>
            ))}
        </div>
    )
}

export default BuildingsList;