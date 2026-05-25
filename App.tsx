import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const API_KEY = '4d93bed4-99a2-4927-9ec3-982ba478a223';

type Team = {
  id: number;
  abbreviation: string;
  city: string;
  conference: string;
  division: string;
  full_name: string;
  name: string;
};

type TeamStar = {
  playerName: string;
  playerId: number;
  careerPoints: number;
};

const teamStars: Record<string, TeamStar> = {
  ATL: { playerName: 'Trae Young', playerId: 1629027, careerPoints: 7800 },
  BOS: { playerName: 'Jayson Tatum', playerId: 1628369, careerPoints: 12000 },
  BKN: { playerName: 'Kevin Durant', playerId: 201142, careerPoints: 24500 },
  CHA: { playerName: 'LaMelo Ball', playerId: 1630164, careerPoints: 3200 },
  CHI: { playerName: 'Zach LaVine', playerId: 203897, careerPoints: 9500 },
  CLE: { playerName: 'LeBron James', playerId: 2544, careerPoints: 38600 },
  DAL: { playerName: 'Luka Dončić', playerId: 1629029, careerPoints: 10600 },
  DEN: { playerName: 'Nikola Jokić', playerId: 203999, careerPoints: 11800 },
  DET: { playerName: 'Cade Cunningham', playerId: 1630162, careerPoints: 2100 },
  GSW: { playerName: 'Stephen Curry', playerId: 201939, careerPoints: 22500 },
  HOU: { playerName: 'Jalen Green', playerId: 1629675, careerPoints: 2200 },
  IND: { playerName: 'Tyrese Haliburton', playerId: 1630165, careerPoints: 1900 },
  LAC: { playerName: 'Kawhi Leonard', playerId: 202695, careerPoints: 14800 },
  LAL: { playerName: 'LeBron James', playerId: 2544, careerPoints: 38600 },
  MEM: { playerName: 'Ja Morant', playerId: 1629630, careerPoints: 6300 },
  MIA: { playerName: 'Jimmy Butler', playerId: 202710, careerPoints: 11800 },
  MIL: { playerName: 'Giannis Antetokounmpo', playerId: 203507, careerPoints: 16600 },
  MIN: { playerName: 'Karl-Anthony Towns', playerId: 1626157, careerPoints: 12000 },
  NOP: { playerName: 'Zion Williamson', playerId: 1629630, careerPoints: 3400 },
  NYK: { playerName: 'Julius Randle', playerId: 203933, careerPoints: 11000 },
  OKC: { playerName: 'Shai Gilgeous-Alexander', playerId: 1628987, careerPoints: 8200 },
  ORL: { playerName: 'Paolo Banchero', playerId: 1630169, careerPoints: 850 },
  PHI: { playerName: 'Joel Embiid', playerId: 203954, careerPoints: 12300 },
  PHX: { playerName: 'Devin Booker', playerId: 1626164, careerPoints: 10500 },
  POR: { playerName: 'Damian Lillard', playerId: 203081, careerPoints: 19000 },
  SAC: { playerName: "De'Aaron Fox", playerId: 1628366, careerPoints: 9200 },
  SAS: { playerName: 'Victor Wembanyama', playerId: 1644378, careerPoints: 450 },
  TOR: { playerName: 'Pascal Siakam', playerId: 1627783, careerPoints: 8900 },
  UTA: { playerName: 'Donovan Mitchell', playerId: 1628378, careerPoints: 12300 },
  WAS: { playerName: 'Bradley Beal', playerId: 203078, careerPoints: 16000 },
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [displayedTeams, setDisplayedTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://api.balldontlie.io/v1/teams', {
          headers: { Authorization: API_KEY },
        });
        const json = await response.json();
        setAllTeams(json.data || []);
        setDisplayedTeams(json.data || []);
      } catch {
        setError('Não foi possível carregar os times.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setDisplayedTeams(allTeams);
      return;
    }

    const filtered = allTeams.filter((team) =>
      team.full_name.toLowerCase().includes(query)
    );
    setDisplayedTeams(filtered);
  };

  const openTeamModal = (team: Team) => {
    setSelectedTeam(team);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTeam(null);
  };

  const selectedStar = selectedTeam ? teamStars[selectedTeam.abbreviation] : null;

  const teamCountLabel = `${displayedTeams.length} ${
    displayedTeams.length === 1 ? 'time encontrado' : 'times encontrados'
  }`;

  const renderTeam = ({ item }: { item: Team }) => (
    <TouchableOpacity style={styles.teamCard} onPress={() => openTeamModal(item)}>
      <Text style={styles.teamName}>{item.full_name}</Text>
      <Text style={styles.teamInfo}>🏙️ {item.city}</Text>
      <Text style={styles.teamInfo}>📋 {item.conference} — {item.division}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <Text style={styles.title}>Busca de Times NBA</Text>
        <Text style={styles.subtitle}>Use o campo abaixo para buscar um time por nome.</Text>

        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome do time"
            placeholderTextColor="#bbb"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.counterText}>{teamCountLabel}</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#f7a800" style={styles.loader} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            style={styles.list}
            data={displayedTeams}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTeam}
            contentContainerStyle={displayedTeams.length === 0 ? styles.emptyContainer : undefined}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Nenhum time encontrado. Tente outro nome.
              </Text>
            }
          />
        )}

        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Detalhes do Time</Text>
              {selectedTeam ? (
                <>
                  {selectedStar ? (
                    <View style={styles.starContainer}>
                      <Image
                        source={{
                          uri: `https://cdn.nba.com/headshots/nba/latest/1040x760/${selectedStar.playerId}.png`,
                        }}
                        style={styles.starImage}
                      />
                      <Text style={styles.starName}>{selectedStar.playerName}</Text>
                      <Text style={styles.starPoints}>{selectedStar.careerPoints.toLocaleString()} pontos na carreira</Text>
                    </View>
                  ) : null}

                  <Text style={styles.modalLabel}>Nome completo</Text>
                  <Text style={styles.modalValue}>{selectedTeam.full_name}</Text>

                  <Text style={styles.modalLabel}>Abreviação</Text>
                  <Text style={styles.modalValue}>{selectedTeam.abbreviation}</Text>

                  <Text style={styles.modalLabel}>Cidade</Text>
                  <Text style={styles.modalValue}>{selectedTeam.city}</Text>

                  <Text style={styles.modalLabel}>Conferência</Text>
                  <Text style={styles.modalValue}>{selectedTeam.conference}</Text>

                  <Text style={styles.modalLabel}>Divisão</Text>
                  <Text style={styles.modalValue}>{selectedTeam.division}</Text>
                </>
              ) : null}

              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#17408B',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#1d1d1f',
    marginBottom: 18,
    textAlign: 'center',
  },
  searchRow: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f5f6f8',
    color: '#1d1d1f',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d4d4d8',
    marginBottom: 12,
  },
  searchButton: {
    backgroundColor: '#17408B',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  counterText: {
    color: '#1d1d1f',
    marginBottom: 12,
    fontSize: 14,
  },
  loader: {
    marginTop: 24,
  },
  list: {
    flex: 1,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  teamCard: {
    backgroundColor: '#17408B',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#112f69',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  teamName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  teamInfo: {
    color: '#dbe4ff',
    fontSize: 14,
    marginBottom: 4,
  },
  starContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  starImage: {
    width: 120,
    height: 90,
    borderRadius: 12,
    marginBottom: 12,
  },
  starName: {
    color: '#1d1d1f',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  starPoints: {
    color: '#4b5563',
    fontSize: 14,
    marginBottom: 14,
  },
  emptyText: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 24,
  },
  errorText: {
    color: '#ce1141',
    textAlign: 'center',
    marginTop: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 22,
  },
  modalTitle: {
    color: '#17408B',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 18,
  },
  modalLabel: {
    color: '#4b5563',
    fontSize: 13,
    marginTop: 12,
  },
  modalValue: {
    color: '#1d1d1f',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  closeButton: {
    marginTop: 22,
    backgroundColor: '#17408B',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
