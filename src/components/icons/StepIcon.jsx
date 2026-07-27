import CameraIcon from "./CameraIcon.jsx";
import PlanIcon from "./PlanIcon.jsx";
import SensorsIcon from "./SensorsIcon.jsx";
import ProtectionIcon from "./ProtectionIcon.jsx";

// Maps a step's `icon` field (from products.json) to its icon component.
const ICONS = {
  camera: CameraIcon,
  plan: PlanIcon,
  sensor: SensorsIcon,
  protection: ProtectionIcon,
};

export default function StepIcon({ name, ...props }) {
  const Icon = ICONS[name];
  return Icon ? <Icon {...props} /> : null;
}
