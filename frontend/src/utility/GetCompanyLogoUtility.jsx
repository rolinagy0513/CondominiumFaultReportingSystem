import {FaBusinessTime} from "react-icons/fa6";
import { MdElectricBolt } from "react-icons/md";
import { MdPlumbing } from "react-icons/md";
import { FaBroom } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import { GiElevator } from "react-icons/gi";
import { FaLeaf } from "react-icons/fa";
import { IoMdBuild } from "react-icons/io";

export const getServiceIcon = (serviceType) => {
    switch (serviceType?.toUpperCase()) {
        case 'ELECTRICIAN':
            return <MdElectricBolt className="electrician-icon" />;
        case 'PLUMBER':
            return <MdPlumbing className="plumber-icon" />;
        case 'CLEANING':
            return <FaBroom className="cleaning-icon" />;
        case 'SECURITY':
            return <MdSecurity className="security-icon" />;
        case 'ELEVATOR_MAINTENANCE':
            return <GiElevator className="elevator-icon" />;
        case 'GARDENING':
            return <FaLeaf className="gardening-icon" />;
        case 'OTHER':
            return <IoMdBuild className="other-icon" />;
        default:
            return <FaBusinessTime className="default-company-icon" />;
    }
};

export const getServiceTypeDisplay = (serviceType) => {
    switch (serviceType?.toUpperCase()) {
        case 'ELECTRICIAN':
            return 'Electrician';
        case 'PLUMBER':
            return 'Plumber';
        case 'CLEANING':
            return 'Cleaning';
        case 'SECURITY':
            return 'Security';
        case 'ELEVATOR_MAINTENANCE':
            return 'Elevator Maintenance';
        case 'GARDENING':
            return 'Gardening';
        case 'OTHER':
            return 'Other Services';
        default:
            return serviceType || 'Unknown Service';
    }
};