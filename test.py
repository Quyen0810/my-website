import requests
import json

API_URL = "https://vilaw.onrender.com/chat" 

def test_chatbot(question, session_id="test_user"):
    try:
        payload = {
            "question": question,
            "session_id": session_id
        }
        
        response = requests.post(API_URL, json=payload)
        
        if response.status_code == 200:
            result = response.json()
            return result["answer"]
        else:
            return f"Lỗi {response.status_code}: {response.text}"
            
    except requests.exceptions.ConnectionError:
        return "Không thể kết nối tới API. Kiểm tra xem server có đang chạy không."
    except Exception as e:
        return f"Lỗi: {str(e)}"

def main():
    print("=== Test ViLawAI Chatbot ===")
    print("Gõ 'exit' để thoát\n")
    
    while True:
        question = input("💬 Câu hỏi của bạn: ").strip()
        
        if question.lower() in ['exit', 'quit', 'thoát']:
            print("👋 Tạm biệt!")
            break
            
        if not question:
            continue
            
        print("🤖 Đang xử lý...")
        answer = test_chatbot(question)
        print(f"\n📝 Trả lời:\n{answer}\n")
        print("-" * 50)

if __name__ == "__main__":
    main()
