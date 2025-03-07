import { Text } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
export default function CustomText({ children, style, ...props }) {
  return <Text style={[globalStyles.text, style]} {...props}>{children}</Text>;
}

