import { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('appLanguage') || 'JP';
    });


    const translations = {
        JP: {
            nav_home: 'HOME',
            nav_shop: 'SHOP',
            nav_news: 'NEWS',
            nav_admin: 'ADMIN',
            hero_title: '職人の手で、\n心を込めて。',
            hero_subtitle: '厳選された素材と、長年培われた技術。\nあなただけの特別な一品をお届けします。',
            news_title: '最新情報',
            news_empty: '新しいお知らせはありません。',
            about_title: '私たちの想い',
            about_desc1: '工房では、一つひとつの製品に物語を込めて製作しています。\n使うほどに手に馴染み、時と共に深まる味わいをお楽しみください。',
            about_desc2: '「長く愛されるものづくり」をテーマに、\n修理やメンテナンスも承っております。',
            info_title: '店舗情報',
            info_hours_label: '営業時間',
            info_hours_value: '10:00 - 18:00 (水曜定休)',
            info_loc_label: '住所',
            info_loc_value: '東京都渋谷区神宮前 1-2-3',

            // Shop Modal
            shop_title: 'オンラインショップを選択',
            shop_visit: 'ショップへ移動',
            shop_close: '閉じる',

            // Admin
            admin_title: '管理者ダッシュボード',
            admin_login_title: '管理者ログイン',
            admin_sign_out: 'ログアウト',
            admin_tab_news: 'ニュース管理',
            admin_tab_info: '基本情報設定',
            admin_news_new: '記事作成',
            admin_label_title: 'タイトル',
            admin_label_content: '内容',
            admin_label_image: '画像添付 (自動圧縮)',
            admin_btn_submit: '登録する',
            admin_info_logo: 'ロゴ変更',
            admin_info_hours: '営業時間',
            admin_info_address: '住所',
            admin_btn_save: '保存する',
            admin_msg_uploading: '登録中...',
            admin_msg_saving: '保存中...',
            admin_msg_success_news: 'ニュースが登録されました。',
            admin_msg_success_info: '情報が保存されました。',
            admin_error_login: 'ログイン失敗: メールとパスワードを確認してください。',
            admin_error_permission: '権限エラー: データベース規則を確認してください。',
            // New Admin Keys
            admin_day_Mon: '月', admin_day_Tue: '火', admin_day_Wed: '水', admin_day_Thu: '木',
            admin_day_Fri: '金', admin_day_Sat: '土', admin_day_Sun: '日',
            admin_label_select_lang: '入力言語を選択',
            admin_hours_schedule: '営業スケジュール',
            admin_hours_add_btn: '追加',
            admin_hours_step1: '1. 曜日を選択 (複数可)',
            admin_hours_step2: '2. 時間を入力',
            admin_label_holiday: '祝日休業を表示',
            admin_label_today_closed: '本日は臨時休業',
            admin_sec_address: '住所設定 (JP形式)',
            admin_label_zip: '郵便番号',
            admin_label_prefecture: '都道府県',
            admin_label_city: '市区町村',
            admin_label_street: '番地・建物名',
            admin_sec_contact: '連絡先情報',
            admin_label_phone: '電話番号',
            admin_label_email: 'メールアドレス',
            admin_btn_cancel: 'キャンセル',
            admin_msg_updated: '更新完了',
            info_holiday_closed: '※ 祝日休業',
            admin_label_enable_multilang: '多言語機能の有効化'
        },
        KR: {
            nav_home: '홈',
            nav_shop: '쇼핑',
            nav_news: '뉴스',
            nav_admin: '관리자',
            hero_title: '장인의 손길로,\n마음을 담아.',
            hero_subtitle: '엄선된 소재와 오랜 시간 쌓아온 기술.\n당신만을 위한 특별한 제품을 전해드립니다.',
            news_title: '최신 소식',
            news_empty: '새로운 소식이 없습니다.',
            about_title: '우리의 철학',
            about_desc1: '공방에서는 하나하나의 제품에 이야기를 담아 제작합니다.\n쓸수록 손에 익숙해지고, 시간과 함께 깊어지는 멋을 즐겨보세요.',
            about_desc2: '「오래 사랑받는 물건 만들기」를 테마로,\n수리나 유지보수도 하고 있습니다.',
            info_title: '매장 정보',
            info_hours_label: '영업 시간',
            info_hours_value: '10:00 - 18:00 (수요일 휴무)',
            info_loc_label: '주소',
            info_loc_value: '도쿄도 시부야구 진구마에 1-2-3',
            info_holiday_closed: '* 공휴일 휴무',

            // Shop Modal
            shop_title: '온라인 샵 선택',
            shop_visit: '샵으로 이동',
            shop_close: '닫기',

            // Admin
            admin_title: '관리자 대시보드',
            admin_login_title: '관리자 로그인',
            admin_sign_out: '로그아웃',
            admin_tab_news: '뉴스 관리',
            admin_tab_info: '기본 정보 설정',
            admin_news_new: '새 글 작성',
            admin_label_title: '제목',
            admin_label_content: '내용',
            admin_label_image: '이미지 첨부 (자동 압축)',
            admin_btn_submit: '등록하기',
            admin_info_logo: '로고 변경',
            admin_info_hours: '영업 시간',
            admin_info_address: '주소',
            admin_btn_save: '저장하기',
            admin_msg_uploading: '등록 중...',
            admin_msg_saving: '저장 중...',
            admin_msg_success_news: '뉴스가 성공적으로 등록되었습니다.',
            admin_msg_success_info: '정보가 저장되었습니다.',
            admin_error_login: '로그인 실패: 이메일과 비밀번호를 확인하세요.',
            admin_error_permission: '권한 오류: 데이터베이스 규칙을 확인하세요.',
            // New Admin Keys
            admin_day_Mon: '월', admin_day_Tue: '화', admin_day_Wed: '수', admin_day_Thu: '목',
            admin_day_Fri: '금', admin_day_Sat: '토', admin_day_Sun: '일',
            admin_label_select_lang: '입력 언어 선택',
            admin_hours_schedule: '영업 스케줄',
            admin_hours_add_btn: '추가',
            admin_hours_step1: '1. 요일 선택 (중복 가능)',
            admin_hours_step2: '2. 시간 입력',
            admin_label_holiday: '공휴일 휴무 표시',
            admin_label_today_closed: '금일 비상 휴무 (TODAY CLOSED)',
            admin_sec_address: '주소 설정 (JP 형식)',
            admin_label_zip: '우편번호 (Zip Code)',
            admin_label_prefecture: '도도부현 (Prefecture)',
            admin_label_city: '시구정촌 (City)',
            admin_label_street: '나머지 주소 (번지, 건물명)',
            admin_sec_contact: '연락처 정보',
            admin_label_phone: '전화번호 (Phone)',
            admin_label_email: '이메일 (Email)',
            admin_btn_cancel: '취소',
            admin_msg_updated: '수정 완료되었습니다.',
            admin_label_enable_multilang: '다국어 기능 활성화 (Enable Multilingual)'
        },
        EN: {
            nav_home: 'HOME',
            nav_shop: 'SHOP',
            nav_news: 'NEWS',
            nav_admin: 'ADMIN',
            hero_title: 'Crafted with\nHeart & Soul.',
            hero_subtitle: 'Selected materials and years of honed skills.\nWe deliver a special piece just for you.',
            news_title: 'Latest News',
            news_empty: 'No new updates.',
            about_title: 'Our Philosophy',
            about_desc1: 'In our workshop, we craft each product with a story.\nEnjoy the texture accessing your hand and deepening with time.',
            about_desc2: 'With the theme of "Making things loved for a long time",\nwe also accept repairs and maintenance.',
            info_title: 'Information',
            info_hours_label: 'Hours',
            info_hours_value: '10:00 - 18:00 (Closed Wed)',
            info_loc_label: 'Address',
            info_loc_value: '1-2-3 Jingumae, Shibuya-ku, Tokyo',
            info_holiday_closed: '* Holiday Closed',

            // Shop Modal
            shop_title: 'Select Online Shop',
            shop_visit: 'Visit Shop',
            shop_close: 'Close',

            // Admin
            admin_title: 'Admin Dashboard',
            admin_login_title: 'Admin Login',
            admin_sign_out: 'Sign Out',
            admin_tab_news: 'News Management',
            admin_tab_info: 'General Settings',
            admin_news_new: 'Create Post',
            admin_label_title: 'Title',
            admin_label_content: 'Content',
            admin_label_image: 'Attach Image (Auto Compress)',
            admin_btn_submit: 'Submit',
            admin_info_logo: 'Change Logo',
            admin_info_hours: 'Opening Hours',
            admin_info_address: 'Address',
            admin_btn_save: 'Save Changes',
            admin_msg_uploading: 'Uploading...',
            admin_msg_saving: 'Saving...',
            admin_msg_success_news: 'News posted successfully.',
            admin_msg_success_info: 'Settings saved successfully.',
            admin_error_login: 'Login Failed: Check email and password.',
            admin_error_permission: 'Permission Error: Check database rules.',
            // New Admin Keys
            admin_day_Mon: 'Mon', admin_day_Tue: 'Tue', admin_day_Wed: 'Wed', admin_day_Thu: 'Thu',
            admin_day_Fri: 'Fri', admin_day_Sat: 'Sat', admin_day_Sun: 'Sun',
            admin_label_select_lang: 'Select Input Language',
            admin_hours_schedule: 'Business Schedule',
            admin_hours_add_btn: 'Add',
            admin_hours_step1: '1. Select Days',
            admin_hours_step2: '2. Enter Time',
            admin_label_holiday: 'Show Holiday Closed',
            admin_label_today_closed: 'Emergency: TODAY CLOSED',
            admin_sec_address: 'Address Settings (JP Format)',
            admin_label_zip: 'Zip Code',
            admin_label_prefecture: 'Prefecture',
            admin_label_city: 'City / Ward',
            admin_label_street: 'Street details',
            admin_sec_contact: 'Contact Info',
            admin_label_phone: 'Phone',
            admin_label_email: 'Email',
            admin_btn_cancel: 'Cancel',
            admin_msg_updated: 'Update Complete',
            admin_label_enable_multilang: 'Enable Multilingual Support'
        }
    };

    const t = (key) => {
        const lang = translations[language] ? language : 'JP';
        return translations[lang][key] || key;
    };

    // Helper for multi-language data fields (e.g., news title)
    // data can be: "Some String" OR { JP: "...", KR: "...", EN: "..." }
    const t_data = (data) => {
        if (!data) return '';
        if (typeof data === 'string') return data;
        // If object, try current language, then JP, then first available key
        const lang = translations[language] ? language : 'JP';
        return data[lang] || data['JP'] || data['EN'] || data['KR'] || Object.values(data)[0] || '';
    };



    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('appLanguage', lang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t, t_data }}>
            {children}
        </LanguageContext.Provider>
    );
};
