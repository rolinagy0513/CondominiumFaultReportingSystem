import "./component-styles/BuildingsContent.css"

const BuildingsContent = ({buildings}) =>{

    return(
        <div className="buildings-content">
            <div className="content-placeholder">
                <h2>Building Management Dashboard</h2>
                <p>You have {buildings.length} buildings in the system.</p>
                <p>Click on a building in the sidebar to view its apartments.</p>
            </div>
        </div>
    )

}

export default BuildingsContent;