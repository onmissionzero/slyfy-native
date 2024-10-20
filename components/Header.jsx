import { View, Text, Image, StyleSheet } from 'react-native';
import useProfile from '../contexts/profile';

const Header = () => {
  const { profile } = useProfile();

  return (
    <View style={styles.container}>
      <Image
        source={profile && profile.pfp_url ? { uri: profile.pfp_url } : { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIklEQVRoge3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAA8G4wQAAB9qDgAAAAAABJRU5ErkJggg==' }}
        style={styles.image}
        accessibilityLabel="User Icon"
      />
      <Text style={styles.text}>
        {profile ? `${profile.display_name}` : 'No User'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    width: '95%',
    height: 150,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  image: {
    width: 64,
    height: 64,
    marginBottom: 8,
    borderRadius: 32,
  },
  text: {
    fontFamily: 'Montserrat',
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default Header;