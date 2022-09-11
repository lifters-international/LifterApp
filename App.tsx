import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { Provider } from "react-redux";
import { store } from "./redux";
import { useloadFonts } from "./hooks";
import Navigation from "./navigation";

export default function App() {
  const fontLoad = useloadFonts();

  return (
    <Provider store={store}>
      { fontLoad ? <Navigation /> : <></> }
      <StatusBar />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
