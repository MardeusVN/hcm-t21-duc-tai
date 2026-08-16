/**
 * HCM-T21 "Đức hay Tài" — Academic Quiz Data Store
 * 10 multiple-choice questions testing comprehension of Ho Chi Minh's philosophy on Duc & Tai
 * Citations cross-referenced with Giáo trình Tư tưởng Hồ Chí Minh (Chương 6, tr. 134–158)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.HCM = root.HCM || {};
    root.HCM.Data = root.HCM.Data || {};
    Object.assign(root.HCM.Data, factory());
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const QUIZ_QUESTIONS = [
    {
      id: 1,
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
      citation: "Giáo trình tr. 136",
    },
    {
      id: 2,
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
      citation: "Giáo trình tr. 136",
    },
    {
      id: 3,
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
      citation: "Giáo trình tr. 137",
    },
    {
      id: 4,
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
      citation: "Giáo trình tr. 145",
    },
    {
      id: 5,
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
      citation: "Giáo trình tr. 146",
    },
    {
      id: 6,
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
      citation: "Giáo trình tr. 148",
    },
    {
      id: 7,
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
      citation: "Quy ước thiết kế trò chơi / Nhóm tác giả",
    },
    {
      id: 8,
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
      citation: "Giáo trình tr. 136",
    },
    {
      id: 9,
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
        "Mục thực trạng đạo đức và liên hệ sinh viên (trang 157–158): giáo trình đặt vấn đề " +
        "trực tiếp với thanh niên trí thức “Học để làm gì? Học để phục vụ ai?”, làm cơ sở để mỗi " +
        "người xác định phương hướng học tập và sửa chữa khuyết điểm.",
      citation: "Giáo trình tr. 157–158",
    },
    {
      id: 10,
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
      citation: "Giáo trình tr. 141–143",
    },
  ];

  return {
    QUIZ_QUESTIONS,
  };
}));
