from dataclasses import dataclass, asdict
from typing import List, Optional

@dataclass
class QuestionDTO:
    text: str
    options: List[str]
    correct_answers: List[str]
    points: int

@dataclass
class QuizDTO:
    title: str
    author_id: int
    duration: int #u sekundama
    questions: List[QuestionDTO]
    status: str = "PENDING"
    rejection_reason: Optional[str] = None

    def to_disc(self):
        #DTO u format koji razumije MongoDB
        return asdict(self)