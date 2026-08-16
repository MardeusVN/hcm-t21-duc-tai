/* ============================================================
   NỘI DUNG NHÓM ĐIỀN, chỉ sửa trong khối này, không cần đụng
   phần logic bên dưới.

   TRẠNG THÁI NỘI DUNG (2026-08-16):
   - Tình huống 3 & 4 (owner C, Hưng): lấy nguyên văn từ "PHẦN C:
     BẢN CHỐT" trong Group 7 - HCM202.docx. Đây là số liệu ĐÃ CHỐT
     của nhóm, không tự sửa.
   - Tình huống 1, 2 (owner B, Minh) và 5, 6 (owner D, Huân):
     tài liệu gốc chấm điểm bằng thang khác (Tình huống 1–2 dùng
     "Điểm Đức X/5, Điểm Tài Y/5"; Tình huống 5–6 dùng các hạng mục
     riêng như "Chính trực", "Tiến độ ngắn hạn", "Liêm chính"...).
     Các delta Đức/Tài dưới đây là BẢN NHÁP do Claude quy đổi sang
     cùng thang ±2 khi tệ/tốt nhất, ±1/0 ở mức giữa, giữ đúng chiều
     hướng mà tài liệu mô tả (án phạt nặng nhất -> -2, án tốt nhất
     -> +2). B và D cần rà lại và xác nhận trước khi coi là chính
     thức, nếu đổi, phải tính lại 729 đường chơi và ngưỡng bên dưới.
   ============================================================ */

// SCREEN 0
const SITE_TITLE = "Đức hay Tài: Cái nào quan trọng hơn?";
const VOTE_QUESTION_INTRO =
  "Bạn sẽ trải qua 6 tình huống ở ba tầng: sinh viên, nghề nghiệp và quyền lực. " +
  "Mỗi lựa chọn tác động đến hai trục điểm riêng, Đức và Tài, dựa trên luận điểm " +
  "của giáo trình: “đạo đức là tiêu chuẩn cho mục đích hành động, còn tài là phương " +
  "tiện thực hiện mục đích đó” (trang 136). Không có lựa chọn nào tuyệt đối đúng hay sai, " +
  "hãy chọn theo điều bạn tin, rồi xem kết quả nói gì về bạn.";

// Tên hiển thị cho từng tầng (dùng ở Screen 1 và bảng trích dẫn Screen 3).
const LAYER_NAMES = {
  sinh_vien: "Tầng sinh viên",
  nghe_nghiep: "Tầng nghề nghiệp",
  quyen_luc: "Tầng quyền lực",
};

// Modal "Những lý thuyết cần nắm vững": ở Screen 0 bấm nút Đức/Tài (A), ở Screen 1
// bấm vào layer-label (B/C/D), ở Screen 2 bấm nút Kết luận (E). Đây là SCRIPT
// THUYẾT TRÌNH đầy đủ cho cả 5 người, không phải bản tóm tắt, đọc trực tiếp khi
// thuyết trình. Object này gộp chung các trigger không gắn với 1 tình huống cụ
// thể (A/E); LAYER_THEORY bên dưới là loại gắn với tình huống (B/C/D).
const OPENING_THEORY = {
  duc: [
    {
      title: "Đức",
      source: "trang 134–137",
      script:
        "Trước khi bước vào 6 tình huống, mình xin giải thích khung lý thuyết nền của cả " +
        "trò chơi, bắt đầu từ chữ Đức.\n\n" +
        "Giáo trình ví con người như cây, như sông: “Cũng như sông thì có nguồn mới có " +
        "nước, không có nguồn thì sông cạn. Cây phải có gốc, không có gốc thì cây héo. " +
        "Người cách mạng phải có đạo đức, không có đạo đức thì dù tài giỏi mấy cũng không " +
        "lãnh đạo được nhân dân” (trang 134–135).\n\n" +
        "Đức, theo tư tưởng Hồ Chí Minh, là đạo đức, là phẩm chất, là mục đích đúng đắn " +
        "của hành động. Nói cách khác, Đức trả lời câu hỏi: mình làm việc này để làm gì, " +
        "có đúng không? Trang 136 viết rõ hơn: “Đạo đức là tiêu chuẩn cho mục đích hành " +
        "động.” Và trang 137 khẳng định: “Đức là gốc, là trước hết.”\n\n" +
        "Nhưng chữ “gốc” ở đây dễ bị hiểu lầm. Gốc không có nghĩa là chỉ cần đức là đủ, " +
        "mà là nền tảng, là thứ tự ưu tiên khi xây dựng con người. Vì vậy ngay sau đây, " +
        "mình sẽ nói tiếp phần thứ hai, quan trọng không kém: chữ Tài.",
    },
  ],
  tai: [
    {
      title: "Tài",
      source: "trang 136–137",
      script:
        "Nếu Đức trả lời câu hỏi “làm để làm gì”, thì Tài trả lời câu hỏi: “mình có khả " +
        "năng làm việc đó tốt hay không?”\n\n" +
        "Trang 136 viết: “Nếu đạo đức là tiêu chuẩn cho mục đích hành động thì tài là " +
        "phương tiện thực hiện mục đích đó. Vì vậy, con người cần có cả đức và tài, nếu " +
        "thiếu tài thì làm việc gì cũng khó, nhưng thiếu đạo đức thì vô dụng, thậm chí có " +
        "hại.”\n\n" +
        "Đây là chỗ nhiều người hiểu lầm nhất khi nghe câu “đức là gốc”: tưởng rằng tài " +
        "không quan trọng bằng. Nhưng trang 137 nói thẳng: “Tài là cực kỳ quan trọng, " +
        "không có tài thì không xây dựng, phát triển được đất nước.” Gốc chỉ thứ tự nền " +
        "tảng, không phải thứ để thay thế tài.\n\n" +
        "Vì vậy, trong trò chơi hôm nay, mỗi lựa chọn của các bạn sẽ được chấm trên hai " +
        "trục hoàn toàn độc lập, Đức và Tài, không gộp chung thành một điểm số duy nhất. " +
        "Một lựa chọn có thể vừa đúng vừa hiệu quả, hoặc đúng nhưng chưa đủ hiệu quả, hoặc " +
        "hiệu quả nhưng sai, và chính sự tách biệt này sẽ giúp các bạn thấy rõ đức và tài " +
        "vận hành với nhau như thế nào qua sáu tình huống sắp tới.",
    },
  ],
  // E, kết luận, trang 153-157: gắn vào nút "Kết luận" ở Screen 2 (trang kết quả).
  ket_luan: [
    {
      title: "Thực trạng đạo đức hiện nay",
      source: "trang 153",
      script:
        "Sau khi cả lớp đã trải qua sáu tình huống, mình xin chốt lại bằng bức tranh thực " +
        "trạng đạo đức mà giáo trình mô tả ở trang 153, để thấy kết quả vừa rồi không phải " +
        "chuyện xa lạ, mà đang phản ánh đúng thực tế.\n\n" +
        "Giáo trình đánh giá thực trạng theo hai mặt. Mặt tích cực: phần lớn sinh viên, " +
        "thanh niên trí thức vẫn giữ được lối sống nhân hậu, tình nghĩa, trong sạch; khiêm " +
        "tốn, cần cù, sáng tạo trong học tập và nghiên cứu; có chí lập thân, lập nghiệp; " +
        "năng động, nhạy bén, dám đối mặt khó khăn và dám chịu trách nhiệm.\n\n" +
        "Nhưng mặt tiêu cực cũng được nêu thẳng: đạo đức, lối sống có mặt xuống cấp đáng lo " +
        "ngại, tình trạng suy thoái về tư tưởng chính trị, đạo đức, lối sống có chiều hướng " +
        "gia tăng, xuất hiện chủ nghĩa cá nhân, bệnh cơ hội, quan liêu, tham nhũng, lãng " +
        "phí.\n\n" +
        "Nhìn lại kết quả cả lớp vừa chọn qua sáu tình huống, các bạn có thể tự thấy: mình " +
        "đang ở nhóm nào trong bức tranh đó, phần đông chọn đúng, hay có xu hướng nghiêng " +
        "về phía dễ dãi hơn?",
    },
    {
      title: "Liên hệ sinh viên: Học để làm gì? Học để phục vụ ai?",
      source: "trang 153–157",
      script:
        "Giáo trình chỉ rõ một bộ phận sinh viên có biểu hiện: phai nhạt niềm tin, lý " +
        "tưởng; mất phương hướng phấn đấu; không có chí lập thân, lập nghiệp; chạy theo " +
        "lối sống thực dụng; thiếu trách nhiệm với gia đình và xã hội.\n\n" +
        "Và đây là câu hỏi mà giáo trình đặt ra trực tiếp cho thanh niên trí thức, cũng là " +
        "câu mình muốn khép lại buổi thuyết trình hôm nay: “Học để làm gì? Học để phục vụ " +
        "ai?”\n\n" +
        "Sáu tình huống vừa rồi, từ giảng đường đến công sở đến vị trí lãnh đạo, đều xoay " +
        "quanh một câu trả lời chung: học không chỉ để có bằng cấp hay một công việc tốt, " +
        "mà còn để hình thành năng lực, nhân cách và trách nhiệm với bản thân, gia đình và " +
        "xã hội. Đức là gốc để định hướng hành động, còn tài là năng lực để biến mục tiêu " +
        "đó thành kết quả thật. Một sinh viên tốt không chỉ là người học giỏi, mà còn phải " +
        "là người trung thực, có trách nhiệm và biết dùng năng lực của mình để tạo ra giá " +
        "trị tích cực.",
    },
  ],
};

// B/C/D, mỗi tầng gắn với 2 tình huống, 2 điểm lý thuyết.
const LAYER_THEORY = {
  sinh_vien: [
    {
      title: "Xây đi đôi với chống, lấy xây làm chính",
      source: "trang 146",
      script:
        "Nguyên tắc này là chìa khóa để hiểu Tình huống 2, lúc các bạn phát hiện một " +
        "thành viên trong nhóm gần như không đóng góp gì suốt ba tuần, nhưng vẫn đứng tên " +
        "đầy đủ trong báo cáo.\n\n" +
        "Giáo trình viết ở trang 146: “Xây phải đi đôi với chống, muốn xây phải chống, " +
        "chống nhằm mục đích xây, lấy xây làm chính.” Nghĩa là: phát hiện cái sai không phải " +
        "để dừng lại ở đó, mà phải hướng tới sửa sai, giữ được cả sự công bằng lẫn sự đoàn " +
        "kết.\n\n" +
        "Nhìn lại ba lựa chọn trong tình huống: nếu chọn im lặng, tự gánh phần việc còn lại, " +
        "đó là “xây” một chiều, không có “chống”, vì đang bao che cho một hành vi sai, và " +
        "về lâu dài chính sự bao che đó lại gây bất công cho cả nhóm. Nếu chọn tố cáo gay " +
        "gắt ngay trên nhóm chat, đó là “chống” mà không “xây”, đúng nguyên tắc công bằng " +
        "nhưng thiếu tình nghĩa, dễ làm mất đoàn kết. Còn lựa chọn trao đổi thẳng thắn " +
        "trước, rồi mới báo minh bạch với nhóm kèm đề xuất khắc phục, đây mới là “xây đi " +
        "đôi với chống” đúng nghĩa: chống để xây, không dập tắt cơ hội sửa sai của bạn " +
        "mình. Vì vậy lựa chọn này được điểm cao nhất ở cả hai trục Đức và Tài.",
    },
    {
      title: "Thanh niên phải có đức, có tài",
      source: "trang 157",
      script:
        "Câu này Hồ Chí Minh dùng để nói với thanh niên, và Tình huống 1, còn 12 tiếng " +
        "nữa là hạn nộp đồ án, có sẵn một file gần giống đề bài để “qua”, chính là phép " +
        "thử trực tiếp cho câu nói đó.\n\n" +
        "Nếu chọn copy và sửa nhanh để nộp đúng hạn, các bạn có vẻ như đã “có tài”, vì " +
        "deadline được giải quyết. Nhưng đó là một “tài” giả, vì nó không đến từ năng lực " +
        "thật, mà từ gian dối học thuật. Nhóm chấm phương án này thấp ở cả hai trục, vừa " +
        "thiếu đức vì gian dối, vừa thiếu tài vì không có năng lực thực chất đứng sau.\n\n" +
        "Ngược lại, nếu chọn xin gia hạn và tự làm dù nộp trễ, đó mới là “có đức”, dám " +
        "nhận thiếu sót, trung thực với giảng viên, và cũng là “có tài” thật, vì sản phẩm " +
        "cuối cùng là năng lực của chính mình, dù chưa hoàn thiện tối đa. Đây là lựa chọn " +
        "được điểm cao nhất, vì nó thể hiện đúng tinh thần “lấy xây làm chính”: sự trung " +
        "thực và tự chịu trách nhiệm quan trọng hơn việc đúng hạn về mặt hình thức.",
    },
  ],
  nghe_nghiep: [
    {
      title:
        "Đạo đức là tiêu chuẩn cho mục đích hành động, tài là phương tiện thực hiện mục đích đó",
      source: "trang 136",
      script:
        "Đây là câu nền của toàn bộ tầng nghề nghiệp. Tình huống 3, phát hiện lỗ hổng " +
        "bảo mật hai ngày trước ngày phát hành lớn nhất năm, là nơi câu này bộc lộ rõ " +
        "nhất.\n\n" +
        "Nếu chọn im lặng để bản phát hành ra đúng lịch, phương án này được Tài cộng hai, " +
        "cao nhất toàn trò chơi, vì trên thực tế người chọn im lặng thật sự đạt kết quả " +
        "tốt theo thước đo của tổ chức: đúng hạn, được thưởng, được khen là biết ưu tiên " +
        "việc gì trước. Nhóm mình không hạ thấp điều đó, vì nếu trừ điểm cả hai trục cho " +
        "phương án sai thì trò chơi sẽ thành một bài giảng đạo đức giả tạo, chọn đúng luôn " +
        "thắng, và không chứng minh được điều gì cả.\n\n" +
        "Nhưng chính vì im lặng có lợi thật, câu hỏi của giáo trình mới đáng hỏi: đạo đức " +
        "Hồ Chí Minh là đạo đức trong hành động, lấy hiệu quả thực tế làm thước đo. Câu này " +
        "chặn hai chiều. Chiều thứ nhất: có đức không có nghĩa là không làm gì sai, phải " +
        "ra kết quả tốt. Chiều thứ hai, quan trọng hơn ở đây: người chọn im lặng không thể " +
        "nói “tôi có làm gì đâu”, vì thước đo là hiệu quả thực tế, mà hiệu quả thực tế là " +
        "mười hai nghìn người dùng mất dữ liệu bốn tháng sau đó.",
    },
    {
      title: "Đức và tài, hồng và chuyên, phẩm chất và năng lực phải thống nhất làm một",
      source: "trang 136",
      script:
        "Nếu Tình huống 3 hỏi “khi biết một điều sai, bạn có nói không”, thì Tình huống 4 " +
        "hỏi một câu khó hơn: “khi chính công việc của bạn là tạo ra điều sai đó, bạn làm " +
        "gì?” Đây là tình huống trung tâm của cả tầng nghề nghiệp, vì nó là tình huống duy " +
        "nhất mà làm giỏi hơn thì hại nhiều hơn.\n\n" +
        "Ở phương án triển khai đúng thiết kế, nếu viết code kém, tính năng chạy giật, ít " +
        "người bị ảnh hưởng. Nhưng nếu giỏi, thuật toán càng hiệu quả, càng nhiều học sinh " +
        "mất ngủ. Câu hỏi đặt ra là: có thể tách năng lực chuyên môn khỏi đạo đức không? " +
        "Nếu tách được, phương án “chỉ viết code, không quyết định gì” phải là phương án " +
        "trung tính. Nhưng các bạn vừa thấy: nó không hề trung tính.\n\n" +
        "Trang 136 viết: “đức và tài, hồng và chuyên, phẩm chất và năng lực phải thống " +
        "nhất làm một.” Nhóm mình hiểu câu này không phải như một lời khuyên đạo đức, mà " +
        "như một mô tả thực tế: chuyên môn và đạo đức không tách ra được. Cũng chính vì " +
        "vậy, phương án từ chối làm chỉ được Đức cộng một, không phải cộng hai, vì đạo đức " +
        "lấy hiệu quả thực tế làm thước đo, và người rút lui tuy giữ được mình sạch nhưng " +
        "không tạo ra thay đổi nào, tính năng vẫn ra mắt, người làm thay còn làm tệ hơn. " +
        "Chỉ có phương án nhận làm và đo chỉ số tác hại mới tạo ra thay đổi thật, vì ở đó " +
        "chuyên môn được dùng làm công cụ bảo vệ mục đích đúng, đúng tinh thần thống nhất " +
        "đức–tài.",
    },
  ],
  quyen_luc: [
    {
      title: "Vừa hiền lại vừa minh",
      source: "trang 92",
      script:
        "“Vừa hiền lại vừa minh” là câu Hồ Chí Minh dùng khi nói về người thay mặt nhân " +
        "dân, vừa là đày tớ, vừa là người lãnh đạo. Hiền là đức, là sự trung thực, tận " +
        "tụy. Minh là tài, là trí tuệ, sự sáng suốt. Trang 92 viết rõ: “để làm người thay " +
        "mặt nhân dân phải gồm đủ cả đức và tài, phải vừa hiền lại vừa minh.”\n\n" +
        "Tình huống 5 đặt các bạn vào vai trưởng nhóm, chỉ được chọn một người vào vị trí " +
        "phó nhóm giữa An, giỏi chuyên môn nhưng từng lách luật và hay nói quá thành tích, " +
        "và Bình, năng lực trung bình nhưng luôn trung thực, kể cả khi báo tin xấu.\n\n" +
        "Nếu chọn An, đó là chọn “minh” mà bỏ “hiền”, dự án ban đầu chạy nhanh, nhưng An " +
        "dần thao túng báo cáo để nhóm trông hoàn hảo, che giấu rủi ro thật, và sai lầm bị " +
        "giấu kín sẽ bùng phát nặng nề hơn nhiều so với nếu được phát hiện sớm. Nếu chọn " +
        "Bình, đó là chọn “hiền” mà bớt “minh”, nhóm chạy chậm hơn vì Bình cần thời gian " +
        "học hỏi, nhưng mọi báo cáo đều chính xác, vấn đề được phát hiện sớm, và về dài hạn " +
        "nhóm phát triển bền vững hơn.\n\n" +
        "Còn nếu chọn cả hai, phân vai rõ ràng và giám sát An chặt, đây là lựa chọn gần " +
        "nhất với “vừa hiền lại vừa minh” thật sự: vừa có tốc độ từ An, vừa có độ tin cậy " +
        "nhờ Bình giám sát chéo. Cách này tốn công sức quản lý hơn, nhưng đó chính là cái " +
        "giá thật của việc kết hợp cả đức và tài, chứ không phải chọn một trong hai.",
    },
    {
      title: "Cần – Kiệm – Liêm – Chính, Chí công vô tư",
      source: "trang 141–143",
      script:
        "Trong năm chuẩn mực Cần, Kiệm, Liêm, Chính, Chí công vô tư mà giáo trình nêu ở " +
        "trang 141 đến 143, Tình huống 6 tập trung vào chữ Liêm. Giáo trình định nghĩa " +
        "Liêm là trong sạch, không tham địa vị, tiền tài, sung sướng, “chỉ có một thứ ham " +
        "là ham học, ham làm, ham tiến bộ.” Nghĩa là Liêm không phải là không có nhu cầu cá " +
        "nhân, mà là không lợi dụng vị trí được giao phó để giải quyết nhu cầu đó.\n\n" +
        "Tình huống đặt các bạn vào vai người giữ quỹ chung của nhóm, và phát hiện có thể " +
        "“linh động” dùng một phần quỹ cho việc cá nhân mà gần như chắc chắn không ai biết, " +
        "vì mình là người duy nhất nắm sổ chi tiêu. Đây chính là khoảnh khắc Hồ Chí Minh " +
        "từng cảnh báo ở trang 141–142: “cán bộ các cơ quan, các đoàn thể, cấp cao thì " +
        "quyền to, cấp thấp thì quyền nhỏ. Dù to hay nhỏ, có quyền mà thiếu lương tâm là có " +
        "dịp đục khoét, có dịp ăn của đút, có dịp dĩ công vi tư.”\n\n" +
        "Nếu chọn tự ý dùng quỹ, định bụng trả lại sau, dù ý định ban đầu không xấu, hành " +
        "vi đã là biểu hiện của việc lẫn lộn công và tư, và minh bạch tài chính luôn để lại " +
        "dấu vết, niềm tin của nhóm sẽ rạn nứt khi sự việc lộ ra. Nếu không đụng đến quỹ, tự " +
        "xoay xở bằng cách khác, đây là lựa chọn giữ đúng tinh thần Liêm trọn vẹn nhất, dù " +
        "bất tiện hơn. Còn nếu chủ động hỏi ý kiến cả nhóm trước khi dùng, đây là bài học " +
        "về nguyên tắc công khai: khi có băn khoăn giữa lợi ích chung và lợi ích riêng, cách " +
        "xử lý đúng đắn là công khai chứ không phải tự quyết âm thầm, dù động cơ ban đầu " +
        "không xấu.",
    },
  ],
};

// SCREEN 1, 6 tình huống, đúng thứ tự & người phụ trách ở bảng mục 2 của spec.
// Nguyên tắc thang điểm: mỗi lựa chọn tác động MẠNH 1 trục (+2/-2) và
// NHẸ/TRUNG TÍNH trục còn lại (-1/0/+1) để tạo đánh đổi thật giữa Đức và Tài.
const SCENARIOS = [
  {
    id: 1,
    layer: "sinh_vien",
    owner: "B",
    title: "Deadline & cám dỗ copy đồ án",
    stimulus:
      "Còn 12 tiếng nữa là hạn nộp đồ án nhóm. Sản phẩm của bạn chưa xong, trong khi " +
      "một anh khóa trên gửi cho bạn file đồ án gần giống đề bài, chỉ cần sửa vài chỗ là “qua”.",
    choices: [
      {
        text: "Copy & sửa nhanh để nộp đúng hạn",
        deltaDuc: -2,
        deltaTai: -2,
        feedback:
          "Bạn lấy file có sẵn, đổi tên biến và số liệu rồi nộp đúng giờ. Deadline trước mắt " +
          "được giải quyết, nhưng đây là gian dối học thuật: nếu bị phát hiện (bài giống nhau) " +
          "bạn có thể nhận điểm 0 hoặc bị kỷ luật, và không tích lũy được năng lực thật nào.",
        source: "trang 146",
      },
      {
        text: "Xin gia hạn, tự làm dù nộp trễ",
        deltaDuc: 2,
        deltaTai: 1,
        feedback:
          "Bạn chủ động liên hệ giảng viên, trình bày khó khăn và xin thêm thời gian hợp lý, " +
          "rồi hoàn thành bằng năng lực thật. Có thể bị trừ điểm vì nộp trễ, nhưng bạn giữ được " +
          "liêm chính, sản phẩm là của chính mình và được ghi nhận thái độ trung thực.",
        source: "trang 146",
      },
      {
        text: "Thức trắng đêm, chắp vá nhiều nguồn không dẫn nguồn",
        deltaDuc: -1,
        deltaTai: 0,
        feedback:
          "Bạn ghép nội dung từ nhiều tài liệu và AI mà không trích dẫn hay kiểm chứng. Bài " +
          "nộp đúng hạn nhưng chất lượng rời rạc, có nguy cơ đạo văn một phần, và bạn hiểu bài " +
          "khá hời hợt khi bị hỏi vấn đáp.",
        source: "trang 146",
      },
    ],
    insight:
      "Theo tinh thần “xây đi đôi với chống, lấy xây làm chính” (trang 146), sự trung thực và tự " +
      "chịu trách nhiệm quan trọng hơn việc đúng hạn về mặt hình thức, nộp đúng hạn bằng gian " +
      "dối vẫn chỉ là một “tài” giả.",
  },
  {
    id: 2,
    layer: "sinh_vien",
    owner: "B",
    title: "Bạn cùng nhóm free-riding",
    stimulus:
      "Gần nộp đồ án, bạn phát hiện một thành viên trong nhóm gần như không đóng góp gì " +
      "suốt 3 tuần, nhưng vẫn đứng tên đầy đủ trong báo cáo.",
    choices: [
      {
        text: "Im lặng, tự gánh phần việc còn lại",
        deltaDuc: -1,
        deltaTai: -1,
        feedback:
          "Bạn không nói gì, âm thầm làm bù để nhóm “êm đẹp”. Không có mâu thuẫn ngắn hạn, " +
          "nhưng bất công kéo dài, bạn quá tải và chất lượng phần việc chung giảm sút vì dồn " +
          "vào một người, còn bạn free-riding thì không hề thay đổi.",
        source: "trang 147",
      },
      {
        text: "Trao đổi thẳng thắn, rồi báo cáo minh bạch với nhóm kèm đề xuất khắc phục",
        deltaDuc: 2,
        deltaTai: 2,
        feedback:
          "Bạn góp ý riêng trước; nếu không cải thiện thì báo minh bạch với cả nhóm kèm đề " +
          "xuất phân công lại. Bạn free-riding có cơ hội sửa sai, nhóm công bằng hơn, và giảng " +
          "viên có căn cứ đánh giá đúng người đúng việc.",
        source: "trang 157",
      },
      {
        text: "Tố cáo gay gắt trên nhóm chat chung, quy chụp nặng nề",
        deltaDuc: -1,
        deltaTai: 0,
        feedback:
          "Bạn công khai chỉ trích ngay, không góp ý riêng trước, khiến bạn ấy mất mặt trước " +
          "cả nhóm. Vấn đề được nêu ra, nhưng nhóm mất đoàn kết và bạn ấy có thể phản ứng tiêu " +
          "cực, ảnh hưởng tinh thần làm việc chung.",
        source: "trang 147",
      },
    ],
    insight:
      "Bao che là “xây” mà không “chống”; tố cáo gay gắt là “chống” mà không “xây”. Lựa chọn " +
      "đúng tinh thần trang 146 là chống để xây, không dập tắt cơ hội sửa sai của người khác.",
  },
  {
    id: 3,
    layer: "nghe_nghiep",
    owner: "C",
    title: "Hai ngày trước release",
    stimulus:
      "Bạn là developer trong một team tám người. Sản phẩm chuẩn bị ra bản lớn nhất năm, " +
      "thứ mà cả team đã làm suốt năm tháng, và là cơ sở xét thưởng quý cho toàn bộ phòng. " +
      "Chiều nay, khi rà lại phần xác thực người dùng, bạn phát hiện một lỗi phân quyền: chỉ " +
      "cần sửa một tham số trong đường dẫn là xem được dữ liệu cá nhân của tài khoản khác, " +
      "họ tên, số điện thoại, lịch sử giao dịch. Vá tạm thì được, nhưng vá đúng cách phải sửa " +
      "lại toàn bộ tầng phân quyền: ít nhất năm ngày, và phải dời ngày phát hành, nghĩa là cả " +
      "team mất thưởng quý. Sáng nay quản lý của bạn vừa nói: “giai đoạn này mình tập trung ra " +
      "bản đã, đừng vẽ thêm việc”. Hiện tại, chỉ có bạn biết về lỗ hổng này.",
    choices: [
      {
        text: "Im lặng, để bản phát hành ra đúng lịch",
        deltaDuc: -2,
        deltaTai: 2,
        feedback:
          "Bản phát hành thành công, chỉ số đẹp, cả phòng nhận thưởng quý và bạn được ghi " +
          "nhận là người biết ưu tiên việc gì trước. Nhưng bốn tháng sau, dữ liệu của mười hai " +
          "nghìn người dùng bị khai thác qua đúng lỗ hổng đó, công ty gọi đây là sự cố kỹ " +
          "thuật ngoài ý muốn, và không ai truy được về bạn.",
        source: "trang 136",
      },
      {
        text: "Viết báo cáo gửi quản lý và trưởng nhóm kỹ thuật",
        deltaDuc: 2,
        deltaTai: -1,
        feedback:
          "Ngày phát hành bị dời hai tuần, cả phòng mất thưởng quý và bạn bị xem là người " +
          "“gây chuyện”. Nhưng vấn đề giờ nằm trên giấy, có ngày giờ, có người nhận, nó không " +
          "còn là gánh nặng của riêng bạn mà là trách nhiệm của tổ chức.",
        source: "trang 136",
      },
      {
        text: "Thức đêm tự vá tạm, không báo ai",
        deltaDuc: 0,
        deltaTai: 1,
        feedback:
          "Bạn vá kịp, phát hành đúng hạn, không ai mất thưởng và không ai biết đã có chuyện " +
          "gì xảy ra. Nhưng quy trình kiểm tra đã để lọt lỗ hổng này vẫn nguyên vẹn, sáu tháng " +
          "sau, một lỗi cùng loại xuất hiện ở phần khác, và lần này người phát hiện không thức " +
          "đêm như bạn.",
        source: "trang 144",
      },
    ],
    insight:
      "Ba lựa chọn trên đều có cái giá thật. Điều khác nhau là ai trả cái giá đó: người dùng, " +
      "cả team, hay chính bạn và người đến sau.",
  },
  {
    id: 4,
    layer: "nghe_nghiep",
    owner: "C",
    title: "Chỉ số phải tăng",
    stimulus:
      "Bạn được giao xây dựng tính năng mới cho ứng dụng của công ty, mục tiêu là tăng thời " +
      "gian sử dụng. Thiết kế đã duyệt: gửi thông báo vào khung giờ khuya tạo cảm giác đang bỏ " +
      "lỡ điều gì đó, ưu tiên đẩy nội dung gây tranh cãi lên đầu bảng tin, làm chậm thao tác " +
      "thoát ứng dụng thêm vài bước. Bản thử nghiệm: thời gian sử dụng trung bình tăng 22%, " +
      "riêng nhóm dưới 18 tuổi tăng gấp đôi. Không có gì bất hợp pháp, không ai bị lộ dữ liệu, " +
      "mọi thứ nằm trong điều khoản người dùng đã đồng ý. Bạn là người viết mã, không phải " +
      "người ra quyết định.",
    choices: [
      {
        text: "Triển khai đúng thiết kế, làm tốt nhất có thể",
        deltaDuc: -2,
        deltaTai: 2,
        feedback:
          "Bạn làm xuất sắc: tính năng chạy mượt, chỉ số vượt kỳ vọng, bạn được nêu tên trong " +
          "báo cáo quý và cân nhắc thăng chức. Một năm sau, bạn đọc một bài báo về tình trạng " +
          "mất ngủ ở học sinh cấp ba, trong phần bình luận có người kể lại đúng trải nghiệm mà " +
          "thuật toán của bạn được thiết kế để tạo ra. Nếu bạn làm kém hơn, ít người bị ảnh " +
          "hưởng hơn.",
        source: "trang 136",
      },
      {
        text: "Từ chối làm, xin chuyển sang nhiệm vụ khác",
        deltaDuc: 1,
        deltaTai: -1,
        feedback:
          "Quản lý không gây khó dễ, bạn được chuyển sang nhiệm vụ bảo trì. Tính năng vẫn ra " +
          "mắt đúng lịch, một đồng nghiệp mới làm thay, cẩn thận nhưng thiếu kinh nghiệm nên " +
          "phần thông báo còn dồn dập hơn cả thiết kế ban đầu. Bạn giữ được tay mình sạch, " +
          "nhưng không còn ở trong phòng để nói bất cứ điều gì nữa.",
        source: "trang 136",
      },
      {
        text: "Nhận làm, đồng thời đo chỉ số tác hại và đề xuất giới hạn",
        deltaDuc: 2,
        deltaTai: 2,
        feedback:
          "Bạn mất thêm hai tuần và bị hỏi vì sao chậm; một nửa phòng cho rằng bạn đang làm " +
          "quá lên. Đề xuất của bạn bị cắt còn một nửa: công ty chỉ đồng ý tắt thông báo khuya " +
          "cho tài khoản dưới 18 tuổi. Đó không phải một chiến thắng, nhưng là thay đổi duy " +
          "nhất trong ba lựa chọn thật sự xảy ra, vì bạn có số liệu, thứ người đứng ngoài " +
          "không thể đưa ra.",
        source: "trang 136",
      },
    ],
    insight:
      "Đây là tình huống duy nhất mà làm giỏi hơn thì hại nhiều hơn. Nếu chuyên môn có thể " +
      "tách rời khỏi đạo đức thì phương án A phải trung tính, nhưng bạn vừa thấy nó không hề " +
      "trung tính.",
  },
  {
    id: 5,
    layer: "quyen_luc",
    owner: "D",
    title: "Ai sẽ vào nhóm nòng cốt?",
    stimulus:
      "Bạn được giao làm trưởng một nhóm dự án quan trọng, chỉ được chọn một người vào vị " +
      "trí phó nhóm. An rất giỏi chuyên môn, nhanh nhạy, từng “lách luật” để nhóm cũ về đích " +
      "trước và hay nói quá thành tích của mình khi báo cáo. Bình năng lực trung bình, chưa " +
      "nhiều kinh nghiệm, nhưng luôn nói thật kết quả, kể cả khi thất bại, và không bao giờ " +
      "nhận công lao không phải của mình.",
    choices: [
      {
        text: "Chọn An, ưu tiên năng lực, bỏ qua tư cách",
        deltaDuc: -2,
        deltaTai: 2,
        feedback:
          "Dự án ban đầu chạy nhanh, nhưng An dần thao túng báo cáo để nhóm trông “hoàn hảo” " +
          "trước cấp trên, che giấu rủi ro thật. Đến giữa dự án, sai lầm bị giấu kín bùng phát, " +
          "gây thiệt hại lớn hơn nhiều so với nếu được phát hiện sớm.",
        source: "trang 92",
      },
      {
        text: "Chọn Bình, ưu tiên trung thực, bỏ qua năng lực",
        deltaDuc: 2,
        deltaTai: -1,
        feedback:
          "Nhóm chạy chậm hơn ban đầu vì Bình cần thời gian học hỏi, nhưng mọi báo cáo đều " +
          "chính xác, vấn đề được phát hiện sớm và xử lý kịp thời. Về dài hạn, nhóm phát triển " +
          "bền vững và được tin tưởng giao thêm dự án.",
        source: "trang 141",
      },
      {
        text: "Chọn cả hai, phân vai rõ ràng và giám sát An chặt",
        deltaDuc: 1,
        deltaTai: 1,
        feedback:
          "Nhóm vừa có tốc độ từ An, vừa có độ tin cậy nhờ Bình giám sát chéo. Cách này đòi " +
          "hỏi bạn phải liên tục theo dõi, tốn công sức quản lý hơn, nhưng nếu duy trì tốt sẽ " +
          "đạt kết quả cân bằng nhất.",
        source: "trang 141",
      },
    ],
    insight:
      "“Để làm người thay mặt nhân dân phải gồm đủ cả đức và tài, phải vừa hiền lại vừa minh” " +
      "(trang 92), nếu chỉ có “minh” mà thiếu “hiền”, tài năng có thể trở thành công cụ gây hại.",
  },
  {
    id: 6,
    layer: "quyen_luc",
    owner: "D",
    title: "Quỹ nhóm trong tay bạn",
    stimulus:
      "Bạn được giao giữ quỹ chung của nhóm (2 triệu đồng, dùng để mua vật tư cho dự án). " +
      "Vào phút cuối, bạn phát hiện có thể “linh động” chi 300.000đ từ quỹ này cho việc cá " +
      "nhân, mà gần như chắc chắn không ai trong nhóm biết, vì bạn là người duy nhất nắm sổ " +
      "chi tiêu.",
    choices: [
      {
        text: "Tự ý dùng 300.000đ, định bụng “trả lại sau”",
        deltaDuc: -2,
        deltaTai: 0,
        feedback:
          "Việc cá nhân giải quyết được ngay, nhưng đến ngày cần chi vật tư, quỹ thiếu hụt và " +
          "nhóm bị động. Dù sau đó bạn hoàn trả đủ, niềm tin của nhóm dành cho bạn đã rạn nứt " +
          "khi sự việc lộ ra, minh bạch tài chính luôn để lại dấu vết.",
        source: "trang 141",
      },
      {
        text: "Không đụng đến quỹ, tự xoay xở việc cá nhân bằng cách khác",
        deltaDuc: 2,
        deltaTai: -1,
        feedback:
          "Việc cá nhân giải quyết chậm hơn hoặc khó khăn hơn, nhưng quỹ nhóm nguyên vẹn, " +
          "minh bạch tuyệt đối. Nhóm tín nhiệm giao bạn quản lý các quỹ lớn hơn trong tương lai.",
        source: "trang 141",
      },
      {
        text: "Chủ động hỏi ý kiến cả nhóm trước khi dùng, công khai minh bạch mục đích",
        deltaDuc: 1,
        deltaTai: 0,
        feedback:
          "Mất thêm thời gian trao đổi, nhưng nếu nhóm đồng ý, việc chi tiêu trở thành quyết " +
          "định tập thể chứ không phải hành vi đơn phương. Nếu nhóm không đồng ý, bạn buộc " +
          "phải tìm cách khác, nhưng không có ai bị “qua mặt”.",
        source: "trang 142",
      },
    ],
    insight:
      "“Có quyền mà thiếu lương tâm là có dịp đục khoét, có dịp ăn của đút, có dịp ‘dĩ công vi " +
      "tư’” (trang 141–142). Liêm không phải là không có nhu cầu cá nhân, mà là không lợi dụng vị " +
      "trí được giao phó để giải quyết nhu cầu đó.",
  },
];

// SCREEN 2, Ngưỡng phân loại (BẢN NHÁP, xem cảnh báo ở đầu file).
// Với bộ delta hiện tại: biên độ Đức chạy -11..+12, biên độ Tài chạy -7..+9.
// Áp dụng đúng nguyên tắc nhóm đã chốt ("ngưỡng đặt gần trung điểm biên độ thực
// tế của từng trục"): trung điểm Đức ~0.5 -> ngưỡng 1; trung điểm Tài ~1 -> ngưỡng 1.
// Đây KHÔNG PHẢI ngưỡng "Đức>1, Tài>4" trong tài liệu gốc, con số đó được tính
// từ delta thật của T1,T2,T5,T6 mà nhóm chưa cung cấp ở định dạng Đức/Tài. Khi B/D
// chốt lại delta thật, phải tính lại ngưỡng (khuyến nghị: liệt kê lại toàn bộ 729
// đường chơi như nhóm đã làm với T3/T4).
const THRESHOLD_DUC = 1;
const THRESHOLD_TAI = 1;

const QUADRANTS = {
  vua_hong_vua_chuyen: {
    name: "Vừa hồng vừa chuyên",
    desc:
      "Bạn chọn những phương án khó nhất: vừa giữ được nguyên tắc, vừa không buông kết quả. " +
      "Trong Di chúc, Hồ Chí Minh dặn phải đào tạo thế hệ kế thừa vừa hồng vừa chuyên. Đây là " +
      "kết cục mà giáo trình hướng tới, và cũng tốn công nhất, như bạn vừa thấy qua các tình huống.",
  },
  dang_tin_bat_luc: {
    name: "Đáng tin nhưng bất lực",
    desc:
      "Bạn giữ được mình sạch, nhưng thường chọn cách rút lui khỏi vấn đề thay vì giải quyết " +
      "nó. Giáo trình nói rõ: thiếu tài thì làm việc gì cũng khó (trang 136), và không có tài thì " +
      "không xây dựng, phát triển được đất nước (trang 137). Trung thực là điều kiện cần, chưa " +
      "phải điều kiện đủ.",
  },
  vo_hai_vo_dung: {
    name: "Vô hại vì vô dụng",
    desc:
      "Bạn phần lớn chọn phương án né tránh: không làm sai rõ ràng, nhưng cũng không làm gì. " +
      "Giáo trình gọi đây là bệnh nói suông, thứ mà tư tưởng đạo đức Hồ Chí Minh, vốn lấy " +
      "hiệu quả thực tế làm thước đo, phản đối trực tiếp.",
  },
  nguy_hiem_nhat: {
    name: "Nguy hiểm nhất",
    desc:
      "Bạn đạt kết quả tốt trong hầu hết tình huống, bằng cách bỏ qua cái giá mà người khác " +
      "phải trả. Đây chính là điều giáo trình cảnh báo: thiếu đạo đức thì vô dụng, thậm chí có " +
      "hại (trang 136). Và xin lưu ý: bạn càng giỏi, thiệt hại càng lớn.",
  },
};

// SCREEN 3
const THEORY_SUMMARY =
  "Trò chơi này dựa trên Giáo trình Tư tưởng Hồ Chí Minh dành cho bậc đại học không chuyên, " +
  "chương 6, mục nói về vai trò của đạo đức cách mạng, các trang 135–148. Luận điểm nền: đạo " +
  "đức là tiêu chuẩn cho mục đích hành động, còn tài là phương tiện thực hiện mục đích đó. Con " +
  "người cần cả hai, thiếu tài thì làm việc gì cũng khó, nhưng thiếu đạo đức thì vô dụng, " +
  "thậm chí có hại. Đó là lý do trò chơi đo hai trục riêng biệt thay vì một thang điểm duy nhất.";

const THEORY_PRINCIPLES =
  "Ba nguyên tắc xây dựng đạo đức cách mạng: (1) Nói đi đôi với làm, nêu gương về đạo đức " +
  "(trang 145), “một tấm gương sống còn có giá trị hơn một trăm bài diễn văn tuyên truyền”; " +
  "(2) Xây đi đôi với chống (trang 146), “xây phải đi đôi với chống, muốn xây phải chống, chống " +
  "nhằm mục đích xây, lấy xây làm chính”; (3) Tu dưỡng đạo đức suốt đời (trang 148), “đạo đức " +
  "cách mạng không phải trên trời sa xuống, nó do đấu tranh, rèn luyện bền bỉ hằng ngày mà " +
  "phát triển và củng cố”.";

const AI_DECLARATION =
  "Nhóm có sử dụng công cụ trí tuệ nhân tạo trong quá trình xây dựng sản phẩm này. Công cụ " +
  "được dùng để: tóm tắt và hệ thống hóa nội dung giáo trình, soạn bản nháp cho các tình " +
  "huống, gợi ý cấu trúc trình bày, và tìm kiếm trường hợp thực tế để đối chiếu. Công cụ " +
  "không được dùng để quyết định luận điểm của nhóm, gán điểm số cho các lựa chọn, hoặc thay " +
  "thế việc đọc giáo trình gốc. Toàn bộ trích dẫn giáo trình đã được từng thành viên đối chiếu " +
  "trực tiếp với bản gốc.";

// Phần B (bảng phân định nội dung web) yêu cầu ghi chú ranh giới hiện ở CẢ trang kết quả
// lẫn trang cơ sở lý luận, tách riêng khỏi AI_DECLARATION để dùng ở cả hai nơi.
const PRODUCT_SCOPE_NOTE =
  "Các tình huống trong trò chơi là mô phỏng do nhóm xây dựng, không phải sự kiện có thật. " +
  "Bảng điểm hai trục và ngưỡng phân loại bốn kết cục là quy ước của nhóm nhằm phân loại kết " +
  "quả, không phải con số lấy từ giáo trình.";

const EXTERNAL_SOURCES = [
  {
    label: "Vụ Joseph Sullivan tại Uber (2016–2022)",
    note:
      "Giám đốc An ninh của Uber trả tin tặc 100.000 đô để giấu vụ rò rỉ dữ liệu của 57 triệu " +
      "người dùng, không báo cơ quan điều tra; bị kết tội cản trở công lý năm 2022. Nguồn: " +
      "thông cáo Bộ Tư pháp Hoa Kỳ.",
  },
  {
    label: "Hồ sơ nghiên cứu nội bộ Instagram (2021)",
    note:
      "Tài liệu nội bộ cho thấy công ty tự nghiên cứu và ghi nhận tác động tiêu cực lên người " +
      "dùng trẻ, rõ nhất ở nhóm nữ thiếu niên về vấn đề hình thể; công ty phản bác cách diễn " +
      "giải này. Nguồn: BBC, Al Jazeera, tài liệu điều trần Hạ viện Hoa Kỳ.",
  },
  {
    label: "Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (Việt Nam)",
    note:
      "Có hiệu lực từ 1/1/2026, thay Nghị định 13/2023; mức phạt có thể lên tới 5% doanh thu. " +
      "Nguồn: Thư viện Pháp luật, bản tin pháp lý EY Việt Nam.",
  },
];

// SCREEN 5/6, Ôn tập kiến thức (10 câu trắc nghiệm), truy cập từ nút trên Screen 2.
// Toàn bộ trích dẫn/số trang dưới đây lấy từ Group 7 - HCM202.docx (đã đối chiếu),
// không phải nội dung suy diễn thêm.
const QUIZ_QUESTIONS = [
  {
    question: "Theo giáo trình, đạo đức và tài năng có quan hệ như thế nào?",
    options: [
      "Đạo đức là tiêu chuẩn cho mục đích hành động, tài là phương tiện thực hiện mục đích đó",
      "Đạo đức và tài năng không liên quan đến nhau",
      "Tài năng quan trọng hơn đạo đức trong mọi trường hợp",
      "Đạo đức chỉ cần thiết với cán bộ lãnh đạo, không cần với sinh viên",
    ],
    correct: 0,
    explanation:
      "“Đạo đức là tiêu chuẩn cho mục đích hành động thì tài là phương tiện thực hiện mục " +
      "đích đó” (trang 136).",
  },
  {
    question:
      "Câu “có tài mà không có đạo đức là người vô dụng, thậm chí có hại” nên hiểu như thế nào?",
    options: [
      "Người không có tài thì không thể làm được việc gì",
      "Người có tài nhưng thiếu đạo đức có thể dùng năng lực để gây hại, chứ không chỉ là vô ích",
      "Người có đạo đức thì không cần rèn luyện tài năng nữa",
      "Câu này chỉ áp dụng cho cán bộ, không áp dụng cho sinh viên",
    ],
    correct: 1,
    explanation:
      "Trang 136: thiếu tài thì làm việc gì cũng khó, nhưng thiếu đạo đức thì vô dụng, thậm " +
      "chí có hại, năng lực bị dùng sai mục đích sẽ gây hại chứ không chỉ đơn thuần vô ích.",
  },
  {
    question: "“Đức là gốc” trong tư tưởng Hồ Chí Minh nghĩa là gì?",
    options: [
      "Chỉ cần có đạo đức là đủ, không cần rèn luyện chuyên môn",
      "Đức và tài là hai thứ tách biệt, không liên quan đến nhau",
      "Đạo đức là nền tảng, định hướng mục đích hành động; tài vẫn cực kỳ quan trọng để thực hiện mục đích đó",
      "Đạo đức quan trọng hơn tài năng nên có thể bỏ qua việc học chuyên môn",
    ],
    correct: 2,
    explanation:
      "Trang 137: “Đức là gốc, là trước hết; tài là cực kỳ quan trọng, không có tài thì " +
      "không xây dựng, phát triển được đất nước.” Chữ “gốc” chỉ thứ tự nền tảng, không phải " +
      "sự thay thế.",
  },
  {
    question:
      "Nguyên tắc xây dựng đạo đức cách mạng nào đối lập trực tiếp với “bệnh nói suông”?",
    options: [
      "Nói đi đôi với làm, nêu gương về đạo đức",
      "Xây đi đôi với chống",
      "Tu dưỡng đạo đức suốt đời",
      "Chí công vô tư",
    ],
    correct: 0,
    explanation:
      "Trang 145: nguyên tắc “nói đi đôi với làm, nêu gương về đạo đức” đối lập hoàn toàn với " +
      "thói đạo đức giả, nói một đằng làm một nẻo.",
  },
  {
    question: "“Xây đi đôi với chống, lấy xây làm chính” (trang 146) nghĩa là gì?",
    options: [
      "Chỉ cần phê phán cái xấu, không cần xây dựng cái tốt",
      "Xây và chống là hai việc tách biệt, làm việc nào trước cũng được",
      "Chỉ áp dụng cho tổ chức Đảng, không áp dụng cho cá nhân",
      "Khơi dậy ý thức đạo đức lành mạnh phải đi liền với chống biểu hiện vô đạo đức, nhưng trọng tâm là xây dựng cái tốt",
    ],
    correct: 3,
    explanation:
      "Trang 146: “Xây phải đi đôi với chống, muốn xây phải chống, chống nhằm mục đích xây, " +
      "lấy xây làm chính.”",
  },
  {
    question: "Theo giáo trình, đạo đức cách mạng được hình thành như thế nào?",
    options: [
      "Có sẵn từ khi sinh ra, không cần rèn luyện",
      "Do đấu tranh, rèn luyện bền bỉ hằng ngày mà phát triển và củng cố",
      "Chỉ hình thành sau khi trở thành cán bộ, đảng viên",
      "Chỉ cần học thuộc lý thuyết là đủ",
    ],
    correct: 1,
    explanation:
      "Trang 148: “Đạo đức cách mạng không phải trên trời sa xuống. Nó do đấu tranh, rèn " +
      "luyện bền bỉ hằng ngày mà phát triển và củng cố. Cũng như ngọc càng mài càng sáng, " +
      "vàng càng luyện càng trong.”",
  },
  {
    question: "Trong trò chơi này, ngưỡng phân loại 4 kết cục được đặt theo nguyên tắc nào?",
    options: [
      "Lấy đúng số liệu ghi trong giáo trình",
      "Chọn ngẫu nhiên cho phân bố đẹp",
      "Đặt gần trung điểm biên độ thực tế của từng trục điểm Đức, Tài",
      "Luôn đặt bằng 0 cho cả hai trục",
    ],
    correct: 2,
    explanation:
      "Ngưỡng là quy ước của nhóm nhằm phân loại kết quả (không lấy từ giáo trình), được đặt " +
      "gần trung điểm biên độ thực tế của mỗi trục, tránh tình trạng phần lớn người chơi dồn " +
      "vào một kết cục duy nhất.",
  },
  {
    question:
      "Kết cục nào trong trò chơi được xem là “nguy hiểm nhất”, và vì sao?",
    options: [
      "Đức cao, Tài thấp, vì không làm được việc gì",
      "Đức thấp, Tài cao, vì năng lực càng giỏi thì thiệt hại gây ra càng lớn",
      "Đức thấp, Tài thấp, vì không đóng góp được gì",
      "Đức cao, Tài cao, vì tốn nhiều công sức nhất",
    ],
    correct: 1,
    explanation:
      "Trang 136: “thiếu đạo đức thì vô dụng, thậm chí có hại”, khi Đức thấp mà Tài cao, " +
      "năng lực bị dùng sai mục đích khiến hậu quả nặng nề hơn, càng giỏi thiệt hại càng lớn.",
  },
  {
    question:
      "Đối với thanh niên trí thức, giáo trình đặt ra câu hỏi liên hệ nào để xác định phương hướng học tập, rèn luyện?",
    options: [
      "“Học ngành nào thì dễ xin việc?”",
      "“Học để có bằng cấp hay để có việc làm tốt?”",
      "“Học để trở thành cán bộ lãnh đạo?”",
      "“Học để làm gì? Học để phục vụ ai?”",
    ],
    correct: 3,
    explanation:
      "Mục thực trạng đạo đức và liên hệ sinh viên (trang 153–157): giáo trình đặt vấn đề " +
      "trực tiếp với thanh niên trí thức “Học để làm gì? Học để phục vụ ai?”, làm cơ sở để mỗi " +
      "người xác định phương hướng học tập và sửa chữa khuyết điểm.",
  },
  {
    question:
      "Trong 5 chuẩn mực “Cần, Kiệm, Liêm, Chính, Chí công vô tư”, chữ “Liêm” được hiểu như thế nào?",
    options: [
      "Chỉ đơn giản là không nhận hối lộ bằng tiền",
      "Trong sạch, không tham địa vị, tiền tài; chỉ ham học, ham làm, ham tiến bộ",
      "Không được có bất kỳ nhu cầu vật chất cá nhân nào",
      "Chỉ áp dụng cho cán bộ cấp cao, không áp dụng cho sinh viên",
    ],
    correct: 1,
    explanation:
      "Trang 141–143: Liêm là trong sạch, không tham địa vị, tiền tài, sung sướng, “chỉ có " +
      "một thứ ham là ham học, ham làm, ham tiến bộ.”",
  },
];

/* ============================================================
   LOGIC, không cần sửa phần dưới đây để điền nội dung.
   ============================================================ */

const state = {
  initialVote: null,
  scenarioIndex: 0,
  totalDuc: 0,
  totalTai: 0,
  answeredCurrent: false,
};

const quizState = {
  index: 0,
  score: 0,
  answered: false,
  wrong: [],
};

function $(id) { return document.getElementById(id); }

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((el) => el.classList.add("hidden"));
  $(id).classList.remove("hidden");
  window.scrollTo(0, 0);
}

/* ---------- SCREEN 0 ---------- */
function initScreen0() {
  $("site-title").textContent = SITE_TITLE;
  document.querySelector(".intro-text").textContent = VOTE_QUESTION_INTRO;

  document.querySelectorAll(".vote-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".vote-btn").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      state.initialVote = btn.dataset.vote;
      $("btn-start").disabled = false;
    });
  });

  $("btn-start").addEventListener("click", () => {
    localStorage.setItem("hcm_t21_initialVote", state.initialVote);
    renderScenario();
    showScreen("screen-1");
  });
}

/* ---------- SCREEN 1 ---------- */
function renderScenario() {
  const scenario = SCENARIOS[state.scenarioIndex];
  state.answeredCurrent = false;

  $("layer-label").textContent = LAYER_NAMES[scenario.layer] || "";

  $("progress-label").textContent = `Tình huống ${state.scenarioIndex + 1}/${SCENARIOS.length}`;
  $("progress-fill").style.width = `${((state.scenarioIndex + 1) / SCENARIOS.length) * 100}%`;
  $("stimulus-text").textContent = scenario.stimulus;

  const list = $("choices-list");
  list.innerHTML = "";
  scenario.choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice-btn";
    btn.textContent = choice.text;
    btn.addEventListener("click", () => handleChoice(idx, btn));
    list.appendChild(btn);
  });

  $("feedback-block").classList.add("hidden");
  $("insight-block").classList.add("hidden");
}

/* ---------- Modal "Những lý thuyết cần nắm vững" (dùng chung A/B/C/D) ---------- */
function openTheoryModal(points) {
  const body = $("modal-body");
  body.innerHTML = "";
  (points || []).forEach((point, idx) => {
    const block = document.createElement("div");
    block.className = "theory-point";

    const title = document.createElement("h4");
    title.className = "theory-point-title";
    title.textContent = points.length > 1 ? `${idx + 1}. ${point.title} ` : `${point.title} `;
    const source = document.createElement("span");
    source.className = "theory-point-source";
    source.textContent = `(${point.source})`;
    title.appendChild(source);

    const script = document.createElement("p");
    script.className = "theory-point-script";
    script.textContent = point.script;

    block.appendChild(title);
    block.appendChild(script);
    body.appendChild(block);
  });

  $("theory-modal").classList.remove("hidden");
}

function closeTheoryModal() {
  $("theory-modal").classList.add("hidden");
  $("layer-label") && $("layer-label").setAttribute("aria-expanded", "false");
}

$("layer-label") && $("layer-label").addEventListener("click", () => {
  const scenario = SCENARIOS[state.scenarioIndex];
  openTheoryModal(LAYER_THEORY[scenario.layer]);
  $("layer-label").setAttribute("aria-expanded", "true");
});

document.querySelectorAll(".theory-trigger").forEach((btn) => {
  btn.addEventListener("click", () => {
    openTheoryModal(OPENING_THEORY[btn.dataset.theoryKey]);
  });
});

$("modal-close") && $("modal-close").addEventListener("click", closeTheoryModal);
$("theory-modal") && $("theory-modal").addEventListener("click", (e) => {
  if (e.target.id === "theory-modal") closeTheoryModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !$("theory-modal").classList.contains("hidden")) closeTheoryModal();
});

function handleChoice(idx, btnEl) {
  if (state.answeredCurrent) return;
  state.answeredCurrent = true;

  const scenario = SCENARIOS[state.scenarioIndex];
  const choice = scenario.choices[idx];

  document.querySelectorAll(".choice-btn").forEach((b) => (b.disabled = true));
  btnEl.classList.add("chosen");

  state.totalDuc += choice.deltaDuc;
  state.totalTai += choice.deltaTai;

  $("feedback-text").textContent = choice.feedback;
  $("delta-duc").textContent = `Đức: ${choice.deltaDuc >= 0 ? "+" : ""}${choice.deltaDuc}`;
  $("delta-tai").textContent = `Tài: ${choice.deltaTai >= 0 ? "+" : ""}${choice.deltaTai}`;
  $("feedback-source").textContent = choice.source ? `Nguồn: ${choice.source}` : "";
  $("feedback-block").classList.remove("hidden");

  $("insight-text").textContent = scenario.insight;
  $("btn-next-scenario").textContent =
    state.scenarioIndex === SCENARIOS.length - 1 ? "Xem kết quả" : "Tình huống tiếp theo";
  $("insight-block").classList.remove("hidden");
}

$("btn-next-scenario") && $("btn-next-scenario").addEventListener("click", () => {
  if (state.scenarioIndex === SCENARIOS.length - 1) {
    renderResult();
    showScreen("screen-2");
  } else {
    state.scenarioIndex += 1;
    renderScenario();
  }
});

/* ---------- SCREEN 2 ---------- */
function classify(totalDuc, totalTai) {
  const goodDuc = totalDuc > THRESHOLD_DUC;
  const goodTai = totalTai > THRESHOLD_TAI;
  if (goodDuc && goodTai) return "vua_hong_vua_chuyen";
  if (goodDuc && !goodTai) return "dang_tin_bat_luc";
  if (!goodDuc && !goodTai) return "vo_hai_vo_dung";
  return "nguy_hiem_nhat";
}

function renderResult() {
  const key = classify(state.totalDuc, state.totalTai);
  const quadrant = QUADRANTS[key];

  $("quadrant-name").textContent = quadrant.name;
  $("quadrant-desc").textContent = quadrant.desc;

  document.querySelectorAll(".quad-bg").forEach((el) => el.classList.remove("quad-active"));
  const activeQuad = document.querySelector(`.quad-bg[data-quad="${key}"]`);
  activeQuad && activeQuad.classList.add("quad-active");

  const initialVote = state.initialVote || localStorage.getItem("hcm_t21_initialVote");
  const voteLabel = initialVote === "tai" ? "Tài" : "Đức";
  $("vote-compare").textContent = `Đầu game bạn chọn: ${voteLabel}. Kết quả cuối: ${quadrant.name}.`;
  $("scope-note-result").textContent = PRODUCT_SCOPE_NOTE;

  // Vẽ chấm kết quả trên biểu đồ SVG (viewBox 300x300, tâm 150,150).
  // Biên độ thực tế hiện tại: Đức -11..+12, Tài -7..+9 (đều nằm trong ±12).
  // Thang điểm mỗi trục tối đa ±12 (6 tình huống x ±2) → scale = 120/12 = 10px/điểm.
  const SCALE = 10;
  const clampedDuc = Math.max(-12, Math.min(12, state.totalDuc));
  const clampedTai = Math.max(-12, Math.min(12, state.totalTai));
  const cx = 150 + clampedTai * SCALE;
  const cy = 150 - clampedDuc * SCALE;
  $("result-dot").setAttribute("cx", cx);
  $("result-dot").setAttribute("cy", cy);
}

$("btn-view-reference") && $("btn-view-reference").addEventListener("click", () => {
  renderReference();
  showScreen("screen-3");
});

// Footer AI Declaration link, hoạt động từ bất kỳ màn hình nào (screen 0/1/2/4).
$("footer-ai-link") && $("footer-ai-link").addEventListener("click", (e) => {
  e.preventDefault();
  renderReference();
  showScreen("screen-3");
});

$("btn-replay") && $("btn-replay").addEventListener("click", () => {
  state.scenarioIndex = 0;
  state.totalDuc = 0;
  state.totalTai = 0;
  state.answeredCurrent = false;
  document.querySelectorAll(".vote-btn").forEach((b) => b.classList.remove("selected"));
  $("btn-start").disabled = true;
  showScreen("screen-0");
});

/* ---------- SCREEN 3 ---------- */
function renderReference() {
  $("theory-summary").textContent = THEORY_SUMMARY;
  $("theory-principles").textContent = THEORY_PRINCIPLES;
  $("ai-declaration").textContent = AI_DECLARATION;
  $("scope-note-theory").textContent = PRODUCT_SCOPE_NOTE;

  const citationList = $("scenario-citations");
  citationList.innerHTML = "";
  let lastLayer = null;
  SCENARIOS.forEach((s) => {
    if (s.layer !== lastLayer) {
      const heading = document.createElement("li");
      heading.className = "citation-layer-heading";
      heading.textContent = LAYER_NAMES[s.layer] || s.layer;
      citationList.appendChild(heading);
      lastLayer = s.layer;
    }
    const li = document.createElement("li");
    const sources = s.choices.map((c) => c.source).filter(Boolean).join(", ");
    li.textContent = `${s.id}. ${s.title}: ${sources || "(chưa có trích dẫn)"}`;
    citationList.appendChild(li);
  });

  const sourceList = $("external-sources");
  sourceList.innerHTML = "";
  if (EXTERNAL_SOURCES.length === 0) {
    const li = document.createElement("li");
    li.textContent = "[Chưa có nguồn ngoài giáo trình, nhóm điền nếu có]";
    sourceList.appendChild(li);
  } else {
    EXTERNAL_SOURCES.forEach((src) => {
      const li = document.createElement("li");
      li.textContent = `${src.label}: ${src.note}`;
      sourceList.appendChild(li);
    });
  }
}

$("btn-back-from-reference") && $("btn-back-from-reference").addEventListener("click", () => {
  showScreen("screen-2");
});

/* ---------- SCREEN 5/6, Ôn tập câu hỏi ---------- */
function startQuiz() {
  quizState.index = 0;
  quizState.score = 0;
  quizState.answered = false;
  quizState.wrong = [];
  renderQuizQuestion();
  showScreen("screen-5");
}

function renderQuizQuestion() {
  const q = QUIZ_QUESTIONS[quizState.index];
  quizState.answered = false;

  $("quiz-progress-label").textContent = `Câu ${quizState.index + 1}/${QUIZ_QUESTIONS.length}`;
  $("quiz-progress-fill").style.width =
    `${((quizState.index + 1) / QUIZ_QUESTIONS.length) * 100}%`;
  $("quiz-question-text").textContent = q.question;

  const list = $("quiz-options-list");
  list.innerHTML = "";
  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice-btn quiz-option";
    btn.textContent = opt;
    btn.addEventListener("click", () => handleQuizAnswer(idx, q));
    list.appendChild(btn);
  });

  $("quiz-feedback-block").classList.add("hidden");
}

function handleQuizAnswer(idx, q) {
  if (quizState.answered) return;
  quizState.answered = true;

  const isCorrect = idx === q.correct;
  if (isCorrect) quizState.score += 1;
  else quizState.wrong.push(q);

  document.querySelectorAll("#quiz-options-list .quiz-option").forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add("correct");
    else if (i === idx) btn.classList.add("incorrect");
  });

  $("quiz-feedback-label").textContent = isCorrect ? "Chính xác" : "Chưa đúng";
  $("quiz-feedback-label").classList.toggle("feedback-correct", isCorrect);
  $("quiz-feedback-label").classList.toggle("feedback-incorrect", !isCorrect);
  $("quiz-feedback-text").textContent = q.explanation;
  $("btn-next-quiz").textContent =
    quizState.index === QUIZ_QUESTIONS.length - 1 ? "Xem kết quả ôn tập" : "Câu tiếp theo";
  $("quiz-feedback-block").classList.remove("hidden");
}

$("btn-next-quiz") && $("btn-next-quiz").addEventListener("click", () => {
  if (quizState.index === QUIZ_QUESTIONS.length - 1) {
    renderQuizResult();
    showScreen("screen-6");
  } else {
    quizState.index += 1;
    renderQuizQuestion();
  }
});

function renderQuizResult() {
  $("quiz-score-text").textContent =
    `Bạn trả lời đúng ${quizState.score}/${QUIZ_QUESTIONS.length} câu.`;

  const list = $("quiz-review-list");
  list.innerHTML = "";
  if (quizState.wrong.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Bạn trả lời đúng tất cả, không có câu nào cần xem lại.";
    list.appendChild(li);
  } else {
    quizState.wrong.forEach((q) => {
      const li = document.createElement("li");
      li.textContent = `${q.question} Đáp án đúng: “${q.options[q.correct]}”.`;
      list.appendChild(li);
    });
  }
}

$("btn-view-quiz") && $("btn-view-quiz").addEventListener("click", startQuiz);
$("btn-retry-quiz") && $("btn-retry-quiz").addEventListener("click", startQuiz);

$("btn-back-from-quiz") && $("btn-back-from-quiz").addEventListener("click", () => {
  showScreen("screen-2");
});

/* ---------- Khởi động ---------- */
initScreen0();
