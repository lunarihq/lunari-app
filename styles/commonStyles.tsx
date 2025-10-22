import { StyleSheet } from 'react-native';

import { Colors } from './colors';

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  scrollView: {
    flex: 1,
    backgroundColor: 'blue',  },

  scrollContentContainer: {
    paddingBottom: 16,
    paddingTop: 8,
  },

section: {
  borderRadius: 16,
  marginBottom: 16,
  padding: 16,
  paddingBottom: 8,
  backgroundColor: 'red',
},
sectionHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
  backgroundColor: 'green',
},

  fab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  
});

export { commonStyles };
export default commonStyles;
