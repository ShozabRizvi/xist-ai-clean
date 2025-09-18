import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc,
  query, 
  orderBy, 
  limit,
  where,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const useChatMessages = (userId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'chatMessages'),
      where('userId', '==', userId),
      orderBy('timestamp', 'asc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const addMessage = async (messageData) => {
    if (!userId) return;
    
    try {
      await addDoc(collection(db, 'chatMessages'), {
        ...messageData,
        userId,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  return { messages, loading, addMessage };
};

export const useAnalysisHistory = (userId) => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setAnalyses([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'analyses'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAnalyses(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const addAnalysis = async (analysisData) => {
    if (!userId) return;
    
    try {
      await addDoc(collection(db, 'analyses'), {
        ...analysisData,
        userId,
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error saving analysis:', error);
    }
  };

  return { analyses, loading, addAnalysis };
};

export const useCommunityPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'communityPosts'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postDocs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postDocs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addPost = async (postData) => {
    try {
      await addDoc(collection(db, 'communityPosts'), {
        ...postData,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const updatePost = async (postId, updates) => {
    try {
      await updateDoc(doc(db, 'communityPosts', postId), {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return { posts, loading, addPost, updatePost };
};
