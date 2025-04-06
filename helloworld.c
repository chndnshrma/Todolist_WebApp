#include <stdio.h>
int main(){
    int N;
    int large;
    int count = 1;
    int number;

    printf("Enter the number of elements: \n ");
    scanf("%d",&N);

    printf("Enter the number: \n ");
    scanf("%d",&number);
    large = number;

    if(count<N){
        for(int i = 0; i < N; i++){
            printf("Enter the number: \n ");
            scanf("%d",&number);

            count++;

            if(number > large){
                large = number;
            }
        }
    }else{
        printf("The number is %d\n",large);
    }
    return 0;
}