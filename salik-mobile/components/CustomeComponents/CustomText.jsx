import { StyleSheet, Text } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';

export default function CustomText({ children, ...props }) {
  return <Text style={[globalStyles.text, style.title]} {...props}>{children}</Text>;
}

const style=StyleSheet.create({
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
  }
}
)