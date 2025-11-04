import { StyleSheet, Text, View, TouchableOpacity, TextInput,ScrollView, Alert } from 'react-native'
import React, { useState, useRef } from 'react'

interface ContactList {
  name: string;
  phone: string;
}
const DanhBa = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [search, setSearch] = useState('');
  const [contacts, setContacts] = useState<ContactList[]>([
    {name: 'Tiêu Chiến', phone: '0577 333 888'},
    {name: 'Khâu Đỉnh Kiệt', phone: '0321 977 345'},
    {name: 'Hoàng Tinh', phone: '0385 222 115'},
    {name: 'Vương Nhất Bác', phone: '0597 434 877'},
  ]);

  const [updatingIndex, setUpdatingIndex] = useState<number | null>(null);

  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validateInput = () => {
    let hasError = false;
    setNameError('');
    setPhoneError('');

    if (!name.trim()) {
      setNameError('⚠️ Vui lòng nhập tên');
      hasError = true;
    }
    if (!phone.trim()) {
      setPhoneError('⚠️ Vui lòng nhập số điện thoại');
      hasError = true;
    } else if (!/^[0-9\s()+-]+$/.test(phone)) {
      setPhoneError('⚠️ Số điện thoại chỉ được chứa số');
      hasError = true;
    } else if (phone.replace(/\D/g, '').length < 9) {
      setPhoneError('⚠️ Số điện thoại quá ngắn');
      hasError = true;
    }

    return !hasError;
  };
  const handleAddContact = () => {
    if (!validateInput()) return;
    
    const newContact = {name, phone};
    setContacts([...contacts,newContact]);
    setName('');
    setPhone('');
    Alert.alert('✅Thêm liên hệ thành công trong danh bạ!')
  }

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdatingContact = (index: number) => {
    const contact = contacts[index];
    setName(contact.name);
    setPhone(contact.phone);
    setUpdatingIndex(index);
  };

  const handleSaveUpdate = () => {
    if (!validateInput() || updatingIndex === null) return;

    const updatedContacts = [...contacts];
    updatedContacts[updatingIndex] = {name, phone};
    setContacts(updatedContacts);
    setUpdatingIndex(null);
    setName('');
    setPhone('');
    Alert.alert('✅Chỉnh sửa liên hệ thành công!')
  } 

  const handleDelete = (index:number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa Liên hệ này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: () => setContacts(contacts.filter((_, i) => i !== index)) },
      ]
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📒Danh Bạ Cute</Text>
      <TextInput placeholder='🌸Nhập tên' style={styles.input} value={name} onChangeText={setName}></TextInput>
      { nameError ? <Text style={styles.error}>{nameError}</Text> : null }
      <TextInput placeholder='📱Nhập số điện thoại' style={styles.input} value={phone} onChangeText={setPhone}></TextInput>
      { phoneError ? <Text style={styles.error}>{phoneError}</Text> : null }
      {updatingIndex === null ? (
        <TouchableOpacity style={styles.buttonAdd} onPress={handleAddContact}>
          <Text style={styles.textButton}>+ Thêm</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.buttonSave} onPress={handleSaveUpdate}>
          <Text style={styles.textButton}>💾 Lưu</Text>
        </TouchableOpacity>
      )}

      <TextInput placeholder='🔎Tìm kiếm' style={styles.input} value={search} onChangeText={setSearch}></TextInput>
      <ScrollView style={styles.listPeople}>
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact, index) => (
          <View key={index} style={styles.card}>
            <View>
              <Text style={styles.cardText}>🙍‍♂️ {contact.name} </Text>
              <Text style={styles.cardText}>📱 {contact.phone} </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleUpdatingContact(index)}>
                  <Text style={styles.icon}>🖊</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(index)}>
                  <Text style={styles.icon}>🗑</Text>
                </TouchableOpacity>
            </View>
          </View>
        ))
        ):(
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#64748B' }}>
            Không tìm thấy liên hệ nào.
          </Text>
        )}
        
      </ScrollView>
    </View>
  )
}

export default DanhBa

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f2b0b0',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,

  },
  input: {
    height: 40,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#FF8F8F',
    marginVertical: 6,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    fontSize: 13,
    marginLeft: 5,
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#b7dcf9',
    borderRadius: 5,
    height: 35,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  textButton: {
    fontSize:16,
  },
  buttonAdd: {
    backgroundColor: '#b7dcf9',
    borderRadius: 5,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonSave: {
    backgroundColor: '#A5F1B6',
    borderRadius: 5,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  listPeople: {
    marginTop: 10,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF1CB',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f4bebe',
  },
  cardText: {
    fontSize: 14,
    color: '#1E293B',
  },
  
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  icon: {
    fontSize: 16,
  },
})